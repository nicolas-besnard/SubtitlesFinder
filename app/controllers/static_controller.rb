class StaticController < ApplicationController

	def index

	end

	require 'zip'

	def download

		if params[:link] && params[:filename]

			zipfile = Tempfile.new('file')
			zipfile.binmode # This might not be necessary depending on the zip file
			zipfile.write(::HTTParty.get(params[:link]).body)
			zipfile.close

			Zip::ZipFile.open(zipfile.path) do |zipfile|

				zipfile.each do |file|

					if file.to_s.split('.').last == 'srt'

						data = zipfile.read(file)

						filename = params[:filename].split('.')
						filename.pop
						filename = filename.join('.') + '.srt'

						File.new(Rails.public_path + '/'+ filename, 'w').write(data.force_encoding('utf-8'))

						send_file(Rails.public_path + '/'+ filename)

					end

				end

			end

		end

	end

end
