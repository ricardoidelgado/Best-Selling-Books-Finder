require "nokogiri"
require "httparty"

# Defining data structure to store scraped data
Book = Struct.new(:url, :title, :author, :price)

# Initializing the list of objects that will contain the scraped data
books = []

# Current iteration
i = 1

# Max pages to scrape
limit = 5

# Iterate over the 5 pages
while i <= limit
  # Initializing the page to scrape
  page_to_scrape = "https://www.barnesandnoble.com/b/books/_/N-1fZ29Z8q8"
  if i != 1
    page_to_scrape = page_to_scrape + "?Nrpp=20&page=" + i.to_s
  end

  # Downloading the target web page
  response = HTTParty.get(page_to_scrape)

  # Parsing the HTML document returned by the server
  document = Nokogiri::HTML(response.body)

  # Selecting all HTML product elements
  html_products = document.css("li.pb-s")

  # Iterating over the list of HTML products
  html_products.each do |html_product|
    # Extracting the data of interest
    # URL of Book
    url = html_product.css("a").first.attribute("href").value
    # Name of Book
    title = html_product.css("h3.product-info-title a").first.text
    # Author of Book
    author = html_product.css("div.product-shelf-author a").first.text
    # Price of Book
    price = html_product.css("span.current a").first.text

    # Storing the scraped data in a Book object
    book = Book.new(url, title, author, price)

    # Adding the book to the list of books
    books.push(book)
  end

  i += 1
end

# Defining the header row of the CSV file
csv_headers = ["url", "title", "author", "price"]
CSV.open("output.csv", "wb", write_headers: true, headers: csv_headers) do |csv|
  # Adding each book as a new row to the CSV File
  books.each do |book|
    csv << book
  end
end
