module CSConsole
  class Recipes
    class NoCm
      def self.description
        <<-TEXT.strip_heredoc
        no_cm - Includes only the console files, nothing from
                Code Mirror. This is nice if the project you
                use this in already has Code Mirror.
        TEXT
      end

      def self.build
        Proc.new do
          output 'compiled'

          input 'app/javascripts' do
            match '**/*.coffee' do
              coffee_script
            end

            match '**/*.js' do
              # minispade
              concat 'cs_console.js'
              # uglify
            end
          end

          input 'app/stylesheets' do
            match '**/*.sass' do
              sass
            end

            match '**/*.css' do
              concat 'cs_console.css'
            end
          end
        end
      end

    end
  end
end