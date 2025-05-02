// TMDB API 관련 설정
const API_KEY = config.API_KEY;
const BASE_URL = config.BASE_URL;
const API_URL = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`;
const SEARCH_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=ko-KR&query=`;

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
        })
        .catch(error => {
            console.error('영화 데이터를 가져오는 중 오류 발생:', error);
        });
}
