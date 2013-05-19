module CSConsole
  class Recipes
    class All
      def self.description
        <<-TEXT.strip_heredoc
        all - Include all files, this includes everything that comes 
              with Code Mirror
        TEXT
      end

      def self.build_options
        Proc.new do
          puts 'options ho!'
        end
      end

      def self.build
        Proc.new do
          output 'compiled'

          # Javascript files
          input 'app' do
            match '**/*.coffee' do
              coffee_script
            end

            match 'javascripts/**/*.js' do
              concat 'cs_console.js'
              # uglify
            end

            match 'vendor/javascripts/**/*.js' do
              concat 'cs_console.js'
              # uglify
            end
          end

          # CSS Files
          input 'app' do
            match '**/*.sass' do
              sass
            end

            match 'stylesheets/**/*.css' do
              concat 'cs_console.css'
            end

            match 'vendor/stylesheets/**/*.css' do
              concat 'cs_console.css'
            end
          end
        end
      end

    end
  end
end