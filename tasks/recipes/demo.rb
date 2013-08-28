module CSConsole
  class Recipes
    class Demo
      def self.description
        <<-TEXT.strip_heredoc
        demo - Build files required for demo app
        TEXT
      end

      def self.build_options
        nil
      end

      def self.build(build_options=nil)
        Proc.new do
          output 'demo_app'

          # Javascript files
          input '.' do
            match 'app/**/*.coffee' do
              coffee_script
            end

            match 'app/javascripts/**/*.js' do
              concat 'cs_console.js'
              # uglify
            end

            match 'app/vendor/javascripts/codemirror/mode/javascript/*.js' do
              concat 'cs_console.js'
              # uglify
            end

            match 'app/vendor/javascripts/*.js' do
              concat 'cs_console.js'
              # uglify
            end
          end

          # CSS Files
          input 'app' do
            match 'app/**/*.sass' do
              sass
            end

            match 'stylesheets/**/*.css' do
              concat 'cs_console.css'
            end

            match 'vendor/**/*.css' do
              concat 'cs_console.css'
            end

            match 'app/vendor/stylesheets/*.css' do
              concat 'cs_console.css'
            end
          end
        end
      end

    end
  end
end