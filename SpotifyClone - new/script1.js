console.log("Lets write Javascript")
let currentSong = new Audio();
let playBtn2 = document.getElementById("playBtn2")
let progressBar = document.getElementById("progressBar")
var songs;
let currFolder;







function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder.replaceAll("/", "%5C")}`)[1])

        }

    }
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img width="27px" class="invert" src="./spotify icon/music.svg" alt="">
        <div class="info">
        <div> ${song.replaceAll("%20", " ").replaceAll("%5C", "").split("(MP3_160K)")[0]}</div>
                            <div></div>
                            </div>
                        <div class="playNow">
                        <span>Play Now</span>
                        <i class=" play1 fa-solid fa-play"></i>
                        </div> </li>`

    }


    // Atach all the event lisnerer to songs

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

            let play1 = Array.from(document.getElementsByClassName("play1"))
            makeAllPlay = (element) => {
                play1.forEach((Element) => {
                    Element.classList.remove("fa-pause")
                    Element.classList.add("fa-play")
                    const list = e.querySelector(".play1")
                    e.querySelector(".play1").classList.remove("fa-play")
                    e.querySelector(".play1").classList.add("fa-pause")
                    
                })
            }
            makeAllPlay()


        })
    })


    return songs;

}

let playMusic = (track, pause = false) => {
    // var audio = new Audio("%5CAnimeSongs%5C" + track + "(MP3_160K).mp3")
    currentSong.src = `${currFolder}/` + track;
    // console.log(currentSong)

    if (!pause) {
        currentSong.play()
        play.classList.remove("fa-circle-play")
        play.classList.add("fa-circle-pause")

    }
    document.querySelector(".playerTittle").innerHTML = decodeURI(track)
    // document.querySelector(".playerDescription").innerHTML = decodeURI(track)
}


async function displayAlbum() {
    let a = await fetch(`http://127.0.0.1:3000/AnimeSongs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("%5CAnimeSongs%5C")) {
            let folder = e.href.replaceAll("/", "").split("%5CAnimeSongs%5C")[1]
            // Get the meta Data of the folder 
            let a = await fetch(`http://127.0.0.1:3000/AnimeSongs/${folder}/info.json`)
            let response = await a.json();
            let songcard = document.querySelector(".songCard")
            songcard.innerHTML = songcard.innerHTML + `<div data-folder="${folder}" class="cardImg">
            <img src="/AnimeSongs/${folder}/cover.jpg" alt="">
            <div class="playBtn"><i id="5" class="playAll fa-solid fa-circle-play"></i></div>
            <div class="songName">${response.tittle}</div>
            <div class="songDis">${response.description}</div>
            </div>`
        }
    }

    Array.from(document.getElementsByClassName("cardImg")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`%5CAnimeSongs%5C${item.currentTarget.dataset.folder}%5C`)
            // console.log(songs,`%5CAnimeSongs%5C${item.currentTarget.dataset.folder}%5C`)
            seekimg()


        })
    })
}


async function seekimg() {
    let a = await fetch(`http://127.0.0.1:3000/${currFolder}/info.json`)
    let response = await a.json();
    let playerNav = document.querySelector(".playerNav")
    playerNav.innerHTML = `<img src="/${currFolder}/cover.jpg" alt="">
            <div class="playbar">
                <div class="playerTittle">${response.tittle}</div>
                <div class="playerDescription">
                    <p>${response.description}</p>
                </div>
            </div>`

}


async function main() {
    await getSongs("AnimeSongs/cns");
    playMusic(songs[0], true)
    //    console.log(songs[0])
    //    playMusic(songs[0])

    displayAlbum()




    playBtn2.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.classList.remove("fa-circle-play")
            play.classList.add("fa-circle-pause")
        } else {
            currentSong.pause()
            play.classList.remove("fa-circle-pause")
            play.classList.add("fa-circle-play")
        }
    })

    //attach a event to time 

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime,currentSong.duration)
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}`
        document.querySelector(".songDuration").innerHTML = `${secondsToMinutesSeconds(currentSong.duration)}`
        let progress = (currentSong.currentTime / currentSong.duration) * 100;
        progressBar.value = progress;
        progressBar.style.background = `linear-gradient(to right, #ffffff ${progress}%,#333 ${progress}%)`;
    })

    progressBar.addEventListener("input", function () {
        let value = this.value;
        this.style.background = `linear-gradient(to right, #ffffff ${value}%,#333 ${value}%)`
        currentSong.currentTime = (progressBar.value * currentSong.duration) / 100;
    })

    //adding event for forward button

    forward.addEventListener("click", (e) => {
        // console.log(songs)
        let index = songs.indexOf(currentSong.src.split(`${currFolder}/`)[1])
        // console.log(index, currentSong.src.split(`${currFolder}/`)[1])
        if ((index + 1) % songs.length > length) {
            playMusic(songs[index + 1].split("(MP3_160K).mp3")[0])

        } else {
            playMusic(songs[0].split("(MP3_160K).mp3")[0])
        }

         let play1 = Array.from(document.getElementsByClassName("play1"))
            makeAllPlay = (element) => {
                play1.forEach((Element) => {
                    Element.classList.remove("fa-pause")
                    Element.classList.add("fa-play")
                    
                })
            }
            makeAllPlay()
        

    })

    currentSong.addEventListener("ended", () => {
        let index = songs.indexOf(currentSong.src.split(`${currFolder}/`)[1])
        if ((index + 1) % songs.length > length) {
            playMusic(songs[index + 1].split("(MP3_160K).mp3")[0])

        } else {
            playMusic(songs[0].split("(MP3_160K).mp3")[0])
        }
    })


    backward.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split(`${currFolder}/`)[1])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1].split("(MP3_160K).mp3")[0])
            // console.log(songs[index-1],songs,currentSong,index)

        } else {
            playMusic(songs[songs.length - 1].split("(MP3_160K).mp3")[0])
        }

    })







}

main()