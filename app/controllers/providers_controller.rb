class Providers::ProvidersController < ApplicationController

	def open_subtitles

		if params[:hash] && params[:size]

			s = Server.new({
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

end
