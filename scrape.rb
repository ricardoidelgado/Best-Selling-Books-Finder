require "nokogiri"
require "httparty"

# Defining data structure to store scraped data
Book = Struct.new(:rank, :url, :title, :author, :price)

# Defining scrape function
def scrape
  # Initializing the list of objects that will contain the scraped data
  @books = []

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

    index = 1 + ((i - 1) * 20)
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
      book = Book.new(index, url, title, author, price)

      # Adding the book to the list of books
      @books.push(book)

      index += 1
    end
    i += 1
  end
  return @books
end

# START OF APP

puts "Welcome the Best Selling Books App!"

run_app = true

puts "Would you like to see the top 100 Best Selling books from Barnes & Noble today?"
input = gets.chomp

while run_app
  if input.downcase == "yes"
    puts "Here are the top 100 Best Selling Books: "
    scrape()
    pp @books

    puts "Please input a book number that you would like more information on or enter 'quit' to quit."
    input = gets.chomp
  else
    run_app = false
  end

  if input.downcase == "quit" || input.downcase == "no"
    run_app = false
  else
    pp @books[input.to_i - 1]
    puts "If there is another book you would like more info, please enter that number or enter 'quit' to quit."
    input = gets.chomp
  end
end

# Prints the result in a CSV File
# # Defining the header row of the CSV file
# csv_headers = ["url", "title", "author", "price"]
# CSV.open("output.csv", "wb", write_headers: true, headers: csv_headers) do |csv|
#   # Adding each book as a new row to the CSV File
#   books.each do |book|
#     csv << book
#   end
# end
