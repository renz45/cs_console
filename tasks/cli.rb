require 'thor'
require "rake-pipeline"
require 'rake-pipeline-web-filters'
require 'fileutils'
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
        puts "Compiling files..."
        project.invoke
        puts "Adding license to compiled files..."
        add_license_to_files('./compiled/cs_console.css', './compiled/cs_console.js')
        puts "Adding version to compiled files..."
        add_version_to_files('./compiled/cs_console.css', './compiled/cs_console.js')
        puts 'Cleaning up temporary files...'
        clean_up_temp_files
        puts 'Finished! Compiled files can be found in /compiled'
      end
    end

    private

    def project
      unless @project
        build_options = nil
        if recipe.build_options
          build_options = instance_exec(&recipe.build_options)
        end
        @project ||= Rake::Pipeline::Project.new.build(&recipe.build(build_options))
      end
      @project
    end

    def recipe
      @recipe ||= CSConsole::Recipes.get_recipe(options[:build_type])
    end

    def clean_up_temp_files
      FileUtils.rm_rf(File.expand_path('./tmp'))
    end

    def add_license_to_files(*file_paths)
      license_content = File.read(File.expand_path('./LICENSE'))

      file_paths.each do |file_path|
        compiled_file = File.expand_path(file_path)
        compiled_fileContent = File.read(compiled_file)
        File.write(compiled_file, "/*\n#{license_content}\n*/\n\n#{compiled_fileContent}")
      end
    end

    def add_version_to_files(*file_paths)
      version_content = File.read(File.expand_path('./Version'))

      file_paths.each do |file_path|
        compiled_file = File.expand_path(file_path)
        compiled_fileContent = File.read(compiled_file)
        File.write(compiled_file, "/*\nCS Console Version: #{version_content}\n*/\n\n#{compiled_fileContent}")
      end
    end
  end
end