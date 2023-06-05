require "nokogiri"
require "httparty"

pages_to_scrape = ["https://www.barnesandnoble.com/b/books/_/N-1fZ29Z8q8"]

# downloading the target web page
response = HTTParty.get("https://www.barnesandnoble.com/b/books/_/N-1fZ29Z8q8")

# Added code for next page
# ?Nrpp=20&page=2

document = Nokogiri::HTML(response.body)

# Container for everything
# div class="resultsListContainer"

Book = Struct.new(:url, :title, :author, :price)
html_products = document.css("li.pb-s")

# pp html_products

books = []

html_products.each do |html_product|
  # URL of Book
  url = html_product.css("a").first.attribute("href").value
  # Name of Book
  title = html_product.css("h3.product-info-title a").first.text
  # Author of Book
  author = html_product.css("div.product-shelf-author a").first.text
  # Price of Book
  price = html_product.css("span.current a").first.text

  book = Book.new(url, title, author, price)

  books.push(book)
end

# pp books

csv_headers = ["url", "title", "author", "price"]
CSV.open("output.csv", "wb", write_headers: true, headers: csv_headers) do |csv|
  books.each do |book|
    csv << book
  end
end
