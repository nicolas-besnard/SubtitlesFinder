require 'ostruct'
require "xmlrpc/client"

class Sub

	attr_reader :url, :format, :language, :rating, :user_ranks, :movie_name,
				:filename, :raw_data, :downloads_count, :bad_reports_count

	def initialize(data)
		@url = URI.parse(data['SubDownloadLink'])
		@format = data['SubFormat']
		@language = "eng"
		@rating = data['SubRating'].to_f
		@user_ranks = data['UserRank']
		@movie_name = data['MovieName']
		@filename = data['SubFileName']
		@downloads_count = data['SubDownloadsCnt'].to_i
		@bad_reports_count = data['SubBad'].to_i
		@raw_data = data
	end

	def <=>(other)
		rating <=> other.rating
	end

	# Totaly subjective formula to evaluate subtitle quality
	# Originaly developed by runa (https://github.com/runa)
	# https://github.com/byroot/ruby-osdb/commit/9d71775#L0R122
	def score
		uploader_score * downloads_count.next * (rating + 1) - bad_reports_count / downloads_count.next
	end

	def uploader_score
		user_ranks.empty? ? 1 : 2
	end

	def body
		@body ||= fetch_body
	end

	def fetch_body
		StringIO.open do |buffer|
			buffer.write(Net::HTTP.get(url))
			buffer.rewind
			return Zlib::GzipReader.new(buffer).read
		end
	end

  end

class OpenSubtitles

	attr_reader :username, :password, :language, :useragent, :client

	CLIENT_ARGS = [:host, :path, :port, :proxy_host, :proxy_port, :http_user, :http_password, :use_ssl, :timeout]

	DEFAULT_OPTIONS = {
		:host => 'api.opensubtitles.org',
		:path => '/xml-rpc',
		:timeout => 10
	}.freeze

	def initialize(options={})
		@username = options[:username] || ''
		@password = options[:password] || ''
		@language = options[:language] || 'eng'
		@useragent = options[:useragent] || 'ruby-osdb v0.1'
		options = DEFAULT_OPTIONS.merge(options)
		@client = XMLRPC::Client.new(*options.values_at(*CLIENT_ARGS))
	end

	def token
		@token ||= login
	end

	def info
		client.call('ServerInfo')
	end

	def login
		response = client.call('LogIn', username, password, language, useragent)
		if response['status'] != '200 OK'
			raise LoginFailed.new("Failed to login with #{username} : #{password}. Server return code: #{response['status']}")
		end
		response['token']
	end

	def check_movie_hash(*hashes)
		client.call('CheckMovieHash', token, hashes)
	end

	def search_subtitles(*queries)
		subs = client.call('SearchSubtitles', token, queries)['data']
		subs ? subs.map { |s| Sub.new(s) } : []
	end

	def serverInfo
		client.call('ServerInfo')
	end

	def logOut
		client.call('LogOut')
	end
end
