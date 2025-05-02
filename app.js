// TMDB API 관련 설정
const API_KEY = config.API_KEY;
const BASE_URL = config.BASE_URL;
const API_URL = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`;
const SEARCH_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=ko-KR&query=`;
const IMG_URL = config.IMG_URL;

// DOM 요소 선택
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const movieContainer = document.getElementById('movie-container');

// 페이지 로드 시 인기 영화 데이터 가져오기
document.addEventListener('DOMContentLoaded', () => {
    getMovies(API_URL);
});

// 영화 데이터 가져오는 함수
function getMovies(url) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log('TMDB API 응답 데이터:', data);
            displayMovies(data.results);
        })
        .catch(error => {
            console.error('영화 데이터를 가져오는 중 오류 발생:', error);
        });
}

// 영화 데이터를 화면에 표시하는 함수
function displayMovies(movies) {
    movieContainer.innerHTML = '';

    if (!movies || movies.length === 0) {
        movieContainer.innerHTML = '<p>검색 결과가 없습니다.</p>';
        return;
    }

    movies.forEach(movie => {
        const { id, title, poster_path, vote_average, overview } = movie;

        // 이미지 처리
        let posterUrl = '';
        if (poster_path) {
            posterUrl = IMG_URL + poster_path;
        } else {
            posterUrl = 'https://movie-phinf.pstatic.net/20210728_221/1627440327667GyoYj_JPEG/movie_image.jpg';
        }

        // 별점 처리
        const rating = vote_average / 2;
        let stars = '⭐'.repeat(Math.floor(rating));
        if (rating % 1 >= 0.5) stars += '⭐';

        // 요약 처리
        if (overview && overview.trim().length > 0) {
            let shortOverview = '';
            if (overview.length > 100) {
                shortOverview = `${overview.substring(0, 100)}...`;
            } else {
                shortOverview = `${overview}`;
            }
            createMovieCard(title, posterUrl, stars, rating, shortOverview);
        } else {
            // 영어 데이터로 대체
            const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`;
            fetch(url)
                .then(function(res) {
                    return res.json();
                })
                .then(function(data) {
                    let engOverview = '요약이 없습니다.';
                    if (data.overview && data.overview.trim().length > 0) {
                        if (data.overview.length > 100) {
                            engOverview = `${data.overview.substring(0, 100)}...`;
                        } else {
                            engOverview = `${data.overview}`;
                        }
                    }
                    createMovieCard(title, posterUrl, stars, rating, engOverview);
                })
                .catch(function(err) {
                    console.error(`영어 요약 가져오기 실패 (ID: ${id})`, err);
                    createMovieCard(title, posterUrl, stars, rating, '요약이 없습니다.');
                });
        }
        
    });
}

// 영화 카드 DOM 생성 함수
function createMovieCard(title, posterUrl, stars, rating, overview) {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie-card');
    movieEl.innerHTML = `
        <img src="${posterUrl}" class="movie-poster" alt="${title}">
        <div class="movie-info">
            <h3 class="movie-title">${title}</h3>
            <p class="movie-rating">${stars} (${rating.toFixed(1)})</p>
            <p class="movie-overview">${overview}</p>
        </div>
    `;
    movieContainer.appendChild(movieEl);
}

// 검색 버튼 클릭 이벤트 처리
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        getMovies(SEARCH_URL + searchTerm);
    } else {
        alert('검색어를 입력해주세요.');
    }
});
