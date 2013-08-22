require File.expand_path('./tasks/recipes/test')
require "rake-pipeline"
require 'rake-pipeline-web-filters'

run Proc.new { |env|
  # Extract the requested path from the request
  path = Rack::Utils.unescape(env['PATH_INFO'])
  use Rack::Static, urls: ["/resources"], root: "test"

  # Only compile the assets when the test.html is requested, this is a bit crude
  # but it speeds up page loads a lot for tests
  if path =~ /test\.html/ || path =~ /demo\.html/
    Rake::Pipeline::Project.new.build(&CSConsole::Recipes::Test.build).invoke
    FileUtils.rm_rf(File.expand_path('./tmp'))
  end

  mime_types = {
    '.js' => 'javascript',
    '.css' => 'css',
    '.html' => 'html'
  }

  mime = mime_types[File.extname(path)] || 'text'

  [200, {'Content-Type' => "text/#{mime}"}, File.open("./#{File.expand_path(path)}", 'r') ]
}