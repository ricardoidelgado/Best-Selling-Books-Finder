# Note: Amazon restricts webscraping from US site. The non-US site seems to work. Going to attempt this with Barnes & Noble to see if it works. If not go forward with nonUS Amazon site.

require "nokogiri"
require "httparty"

# downloading the target web page
response = HTTParty.get("https://www.amazon.in/gp/bestsellers/books/ref=zg_bs_pg_")

# Works
# https://www.amazon.in/gp/bestsellers/books/ref=zg_bs_pg_

# Does not work
# https://www.amazon.com/best-sellers-books-Amazon/zgbs/books/ref=zg_bs_nav_0

document = Nokogiri::HTML(response.body)

pp document

# Container for everything
# div class="a-cardui"

# Test = Struct.new(:div, :url, :span, :name)
html_products = document.css("div.a-cardui")

# pp html_products

html_products.each do |html_product|
  # URL of Book
  url = html_product.css("a.a-link-normal").first.attribute("href").value
  # Name of Book
  name = html_product.css("span div").first.text
  # Author of Book

  # Review of Book

  # Price of Book

  # pp url

  # pp name
  break
end

# Book Title
# a class="a-link-normal"
# span
# div
