require 'sinatra'
require 'rss'
require 'open-uri'
require 'json'

get '/hi' do
  "Hello!"
end

get '/rss/:url' do
  content_type :json
  url = 'http://rss.cnn.com/rss/cnn_topstories.rss'
  feed_json = Array.new
  open(url) do |rss|
    feed = RSS::Parser.parse(rss)

    feed.items.each do |item|
        feed_json.push({:title => item.title.gsub('"',''), :description => item.description.gsub('"','')})
    end
  end

  feed_json.to_json
end