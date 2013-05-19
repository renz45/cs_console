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
        @build_options = Proc.new do
          options = {}
          options[:theme] = ask('Choose a Code Mirror theme. The default is vibrant-ink.')
          options[:theme] = 'vibrant-ink' if options[:theme].length == 0
          options[:modes] = ask('Specify which code highlight modes to include.')
          options[:modes] = options[:modes].gsub(/\s/, '').split(',')
          options
        end
      end

      def self.build(build_options=nil)
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

            build_options[:modes].each do |mode|
              match "vendor/javascripts/codemirror/mode/**/#{mode}.js" do
                concat 'cs_console.js'
                # uglify
              end
            end

            match 'vendor/javascripts/*.js' do
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

            match "vendor/stylesheets/codemirror/theme/#{build_options[:theme]}.css" do
              concat 'cs_console.css'
            end

            match 'vendor/stylesheets/*.css' do
              concat 'cs_console.css'
            end
          end
        end
      end

    end
  end
end