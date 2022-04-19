const container_of_video = document.querySelector('.video-container');
let API_KEY="AIzaSyApV8ZBrM3z2qIBYXhkGXFGTVNN-LpDDx8";
let videofetcher = "https://www.googleapis.com/youtube/v3/videos?";
let channelfetcher = "https://www.googleapis.com/youtube/v3/channels?";
const makeChannelIcon = (video_data) => {
    fetch(channelfetcher + new URLSearchParams({
        key: API_KEY,
        part: 'snippet',
        id: video_data.snippet.channelId
    }))
    .then(res => res.json())
    .then(data => {
        video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
        videodisplayer(video_data);
    })
}
const getCountofviews = (video_data) => {
  fetch(channelfetcher + new URLSearchParams({
      key: API_KEY,
      part: 'statistics',
      id: video_data.snippet.channelId
  }))
  .then(res => res.json())
  .then(data => {
      video_data.viewcount = data.items[0].statistics.viewCount;
  })
}
const videodisplayer = (data) => {
  console.log(data);
    container_of_video.innerHTML += `
    <div class="video" onclick="location.href = 'https://youtube.com/watch?v=${data.id.videoId}'">
        <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
        <div class="content">
            <img src="${data.channelThumbnail}" class="channel-icon" alt="">
            <div class="info">
                <h4 class="title">${data.snippet.title}</h4>
                <p class="channel-name">${data.snippet.channelTitle}</p>
                <p class="viewcount">${data.viewcount}</p>
                <p class="published">${data.snippet.publishedAt}</p>
            </div>
        </div>
    </div>
    `;
}
const searchInput = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.search-btn');
let searchLink = "https://www.googleapis.com/youtube/v3/search?";
searchBtn.addEventListener('click', () => {
  fetch(searchLink + new URLSearchParams({
    key: API_KEY,
    part: 'snippet',
    q: searchInput.value,
    chart: 'mostPopular',
    maxResults: 15,
    type: 'video',
    regionCode: 'IN'
}))
.then(res => res.json())
.then(data => {
  nex_token=data.nextPageToken;
  data.items.forEach(item=>{
    getCountofviews(item);
  })
    data.items.forEach(item => {
    
        makeChannelIcon(item);

    })
})
.catch(err => console.log(err));
})
const for_nextbutton=document.querySelector('.nextbutton');
for_nextbutton.addEventListener('click',()=>{
  fetch(searchLink+new URLSearchParams({
    key: API_KEY,
    part: 'snippet',
    q: searchInput.value,
    maxResults: 15,
    pageToken: nex_token
  }))
  .then(res=>res.json())
  .then(data=>{
    previous_token=data.prevPageToken;
    exclude();
    data.items.forEach(item=>{
      getCountofviews(item);
    })
    data.items.forEach(item => {
    
      makeChannelIcon(item);

  })
  })
})
const for_previousbutton=document.querySelector('.prevbutton');
for_previousbutton.addEventListener('click',()=>{
  fetch(searchLink+new URLSearchParams({
    key: API_KEY,
    part: 'snippet',
    q: searchInput.value,
    maxResults: 15,
    pageToken: previous_token
  }))
  .then(res=>res.json())
  .then(data=>{
    exclude();
    data.items.forEach(item=>{
      getCountofviews(item);
    })
    data.items.forEach(item => {
      makeChannelIcon(item);

  })
  })

})
function exclude(){
  const list=document.getElementById("videodisplay");
  while(list.hasChildNodes()){
    list.removeChild(list.firstChild);
  }
}