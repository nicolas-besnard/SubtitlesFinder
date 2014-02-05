class Providers::OpenSubtitlesController < ApplicationController

	def search_by_hash

		if params[:hash] && params[:size]

			s = ::OpenSubtitles.new({
				username: ENV['OPENSUBTITLES_USERNAME'],
				password: ENV['OPENSUBTITLES_PASSWORD'],
				language: 'eng', useragent: ENV['OPENSUBTITLES_USERAGENT']
			})
			s.token()

			ret = s.search_subtitles(
				moviehash: params[:hash],
				moviebytesize: params[:size],
				sublanguageid: 'eng,fre')
			s.logOut()

			render json: ret

		end

	end

	def search_by_filename

		if params[:filename]

			s = ::OpenSubtitles.new({
				username: ENV['OPENSUBTITLES_USERNAME'],
				password: ENV['OPENSUBTITLES_PASSWORD'],
				language: 'eng', useragent: ENV['OPENSUBTITLES_USERAGENT']
			})
			s.token()

			ret = s.search_subtitles(
				query: params[:filename],
				sublanguageid: 'eng,fre')
			s.logOut()

			render json: ret

		end

	end

end
