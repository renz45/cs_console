require 'active_support/all'

module CSConsole
  class Recipes
    def self.list
      [
        :all,
        :no_cm
      ]
    end

    def self.get_recipe(recipe)
      begin
        "CSConsole::Recipes::#{recipe.to_s.camelize}".constantize
      rescue
        raise StandardError, "The recipe #{recipe} does not exist"
      end
    end
  end
end

# Must stay at the bottom
CSConsole::Recipes.list.each do |recipe|
  require_relative "./recipes/#{recipe.to_s}.rb"
end
