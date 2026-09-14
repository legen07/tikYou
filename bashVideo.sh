file_name=$(echo $1 | grep -Po '(?<=/video/)\d+' )
video_url="$1"

echo $file_name
echo $video_url

yt-dlp -o "./downloads/${file_name}.mp4" $video_url

ffmpeg -i ./downloads/${file_name}.mp4 -i ./shorts_logo.png -filter_complex "scale=trunc(iw*1.05):trunc(ih*1.05),crop=iw/1.05:ih/1.05,drawtext=text='@FYPist':x=w-tw-20:y=h-th-20:fontsize=24:fontcolor=white,overlay=W-w-120:H-h-17" ./videos/${file_name}.mp4

