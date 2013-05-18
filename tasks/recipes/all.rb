module CSConsole
  class Recipes
    class All
      def self.description
        <<-TEXT.strip_heredoc
        all - Include all files, this includes everything that comes 
              with Code Mirror
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
              minispade
              concat 'cs_console.js'
              # uglify
            end
          end

          input 'app/vendor' do
            match '**/*.coffee' do
              coffee_script
            end

            match '**/*.sass' do
              sass
            end

            match '**/*.js' do
              minispade
              concat 'cs_console.js'
            end

            match '**/*.css' do
              concat 'cs_console.css'
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