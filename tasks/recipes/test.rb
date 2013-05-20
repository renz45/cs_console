module CSConsole
  class Recipes
    class Test
      def self.description
        <<-TEXT.strip_heredoc
        test - Build files required for tests
        TEXT
      end

      def self.build_options
        nil
      end

      def self.build(build_options=nil)
        Proc.new do
          output 'test/resources'

          # Javascript files
          input 'app' do
            match '**/*.coffee' do
              coffee_script
            end

            match 'javascripts/**/*.js' do
              concat 'cs_console.js'
              # uglify
            end

            # match 'vendor/javascripts/*.js' do
            #   concat 'cs_console.js'
            #   # uglify
            # end
          end

          # CSS Files
          input 'app' do
            match '**/*.sass' do
              sass
            end

            match 'stylesheets/**/*.css' do
              concat 'cs_console.css'
            end

            match 'vendor/**/*.css' do
              concat 'cs_console.css'
            end
          end
        end
      end

    end
  end
end