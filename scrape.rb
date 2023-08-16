require "nokogiri"
require "httparty"
require "tty-table"
require "launchy"
require "tty-prompt"

# Defining data structure to store scraped data
Book = Struct.new(:number, :url, :title, :author, :price)

# Initializing Prompt
@prompt = TTY::Prompt.new

# Defining scrape function
def scrape_list
  # Initializing the list of objects that will contain the scraped data
  @books = []

  # Current iteration
  i = 1

  # Max pages to scrape
  limit = 5

  # Iterate over the 5 pages
  while i <= limit
    # Initializing the page to scrape
    if @input == "All"
      @page_to_scrape = "https://www.barnesandnoble.com/b/books/_/N-1fZ29Z8q8"
      @label = " "
    elsif @input == "Teens&YA"
      @page_to_scrape = "https://www.barnesandnoble.com/b/books/teens-ya/_/N-1fZ29Z8q8Z19r4"
      @label = " Teens & YA "
    elsif @input == "Kids"
      @page_to_scrape = "https://www.barnesandnoble.com/b/books/kids/_/N-1fZ29Z8q8Ztu1"
      @label = " Kids "
    elsif @input == "Fiction"
      @page_to_scrape = "https://www.barnesandnoble.com/b/fiction/books/_/N-1fZ2usxZ29Z8q8"
      @label = " Fiction "
    elsif @input == "NonFiction"
      @page_to_scrape = "https://www.barnesandnoble.com/b/nonfiction/books/_/N-1fZ2urcZ29Z8q8"
      @label = " NonFiction "
    end
    if i != 1
      @page_to_scrape = @page_to_scrape + "?Nrpp=20&page=" + i.to_s
    end

    # Downloading the target web page
    response = HTTParty.get(@page_to_scrape)

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
  puts "Here are the top 100 Best Selling#{@label}Books: "
end

def render_best_selling_books
  header_array = ["Number", "Title", "Author", "Price"]
  table_array = []
  @books.each do |item|
    temp_array = []
    temp_array << item[0]
    temp_array << item[2]
    temp_array << item[3]
    temp_array << item[4]
    table_array << temp_array
  end

  table = TTY::Table.new(header_array, table_array)

  puts table.render(:ascii)
end

def render_book_info
  header_array = ["Number", "Title", "Author", "Price"]
  table_array = []
  temp_array = []
  temp_array << @selected_book[0]
  temp_array << @selected_book[2]
  temp_array << @selected_book[3]
  temp_array << @selected_book[4]
  table_array << temp_array

  table = TTY::Table.new(header_array, table_array)

  puts table.render(:ascii)

  @input = @prompt.select("Would you like to open the Barnes & Noble page for this book?", %w(Yes No))

  if @input == "Yes"
    Launchy.open("https://www.barnesandnoble.com#{@selected_book[1]}")
  end
end

# START OF APP

run_app = true

puts "Welcome to the Best Selling Books Finder!"

@input = @prompt.select("Which best selling book list would you like to see today?", %w(All Teens&YA Kids Fiction NonFiction))

while run_app
  scrape_list()

  render_best_selling_books()

  @input = @prompt.ask("Please input a book number that you would like more information on or enter '0' to quit.") do |q|
    q.in "0-100"
    q.messages[:range?] = "%{value} out of expected range %{in}"
  end

  while @input != "0"
    @selected_book = @books[@input.to_i - 1]
    render_book_info()

    @input = @prompt.ask("If there is another book you would like more info, please enter that number or enter '0' to quit.") do |q|
      q.in "0-100"
      q.messages[:range?] = "%{value} out of expected range %{in}"
    end
  end
  if @input == "0"
    run_app = false
  end
end
