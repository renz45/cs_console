require 'thor'
require "rake-pipeline"
require 'rake-pipeline-web-filters'
require_relative 'recipes'

require 'pry'

module CSConsole
  class CLI < Thor
    include Thor::Actions

    desc "build", "Build the cs_console with various recipes"
    method_option :build_type, default: :all, aliases: '-t', desc: 'Specify a build type. Use the -l option to list possible builds.'
    method_option :list_builds, aliases: '-l', desc: "List Build types and their descriptions"
    def build
      if options[:list_builds]
        CSConsole::Recipes.list.each do |recipe|
          recipe_class = CSConsole::Recipes.get_recipe(recipe)
          say "#{recipe_class.description}\n"
        end
      else
        block = CSConsole::Recipes.get_recipe(options[:build_type]).build
        puts "Compiling files..."
        Rake::Pipeline::Project.new.build(&block).invoke
        puts "Adding license to compiled files..."
        add_license_to_files('./compiled/cs_console.css', './compiled/cs_console.js')
        puts 'Finished! Compiled files can be found in /compiled'
      end
    end

    private

    def add_license_to_files(*file_paths)
      licenseContent = File.read(File.expand_path('./LICENSE'))

      file_paths.each do |file_path|
        compiledFile = File.expand_path(file_path)
        compiledFileContent = File.read(compiledFile)
        File.write(compiledFile, "/*\n#{licenseContent}\n*/\n\n#{compiledFileContent}")
      end
    end
  end
end