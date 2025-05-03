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
const modal = document.getElementById('movie-modal');
const modalDetails = document.getElementById('modal-details');
const closeBtn = document.querySelector('.close-btn');

// 페이지 로드 시 인기 영화 데이터 가져오기
document.addEventListener('DOMContentLoaded', () => {
    getMovies(API_URL);
    
    // 모달 닫기 이벤트
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // 브라우저 뒤로가기 버튼 처리
    window.addEventListener('popstate', () => {
        if (modal.style.display === 'block') {
            closeModal();
        }
    });
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
            showMovies(data.results);
        })
        .catch(error => {
            console.error('영화 데이터를 가져오는 중 오류 발생:', error);
        });
}

// 영화 데이터를 화면에 표시하는 함수
function showMovies(movies) {
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
            addCard(id, title, posterUrl, stars, rating, shortOverview);
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
                    addCard(id, title, posterUrl, stars, rating, engOverview);
                })
                .catch(function(err) {
                    console.error(`영어 요약 가져오기 실패 (ID: ${id})`, err);
                    addCard(id, title, posterUrl, stars, rating, '요약이 없습니다.');
                });
        }
        
    });
}

// 영화 카드 DOM 생성 함수
function addCard(id, title, posterUrl, stars, rating, overview) {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie-card');
    movieEl.setAttribute('data-id', id);
    movieEl.innerHTML = `
        <img src="${posterUrl}" class="movie-poster" alt="${title}">
        <div class="movie-info">
            <h3 class="movie-title">${title}</h3>
            <p class="movie-rating">${stars} (${rating.toFixed(1)})</p>
            <p class="movie-overview">${overview}</p>
        </div>
    `;
    
    // 카드 클릭 이벤트 - 모달 표시
    movieEl.addEventListener('click', () => {
        getMovieDetails(id);
        history.pushState({id: id}, '', `?movie=${id}`);
    });
    
    movieContainer.appendChild(movieEl);
}

// 영화 상세 정보 가져오기
function getMovieDetails(movieId) {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR&append_to_response=credits`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.overview || data.overview.trim() === '') {
                // 한국어 요약이 없으면 영어 버전 가져오기
                fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`)
                    .then(enResponse => enResponse.json())
                    .then(enData => {
                        data.overview = enData.overview || '요약 정보가 없습니다.';
                        showModals(data);
                    })
                    .catch(error => {
                        console.error('영어 상세 정보 가져오기 실패:', error);
                        showModals(data);
                    });
            } else {
                showModals(data);
            }
        })
        .catch(error => {
            console.error('영화 상세 정보 가져오기 실패:', error);
            alert('영화 상세 정보를 가져오는데 실패했습니다.');
        });
}

// 영화 상세 정보 표시
function showModals(movie) {
    const posterPath = movie.poster_path 
        ? `${IMG_URL}${movie.poster_path}`
        : 'https://movie-phinf.pstatic.net/20210728_221/1627440327667GyoYj_JPEG/movie_image.jpg';
    
    // 개봉일
    let releaseDate = movie.release_date 
        ? new Date(movie.release_date).toLocaleDateString('ko-KR')
        : '정보 없음';
    
    // 장르
    const genres = movie.genres
        ? movie.genres.map(genre => genre.name).join(', ')
        : '정보 없음';
    
    // 출연진 5명까지
    let cast = '정보 없음';
    if (movie.credits && movie.credits.cast && movie.credits.cast.length > 0) {
        cast = movie.credits.cast
            .slice(0, 5)
            .map(actor => actor.name)
            .join(', ');
    }
    
    // 별점 계산
    const rating = movie.vote_average / 2;
    let stars = '⭐'.repeat(Math.floor(rating));
    if (rating % 1 >= 0.5) stars += '⭐';
    
    modalDetails.innerHTML = `
        <img src="${posterPath}" class="modal-poster" alt="${movie.title}">
        <div class="modal-details-content">
            <h2 class="modal-title">${movie.title}</h2>
            <p class="modal-info"><strong>개봉일:</strong> ${releaseDate}</p>
            <p class="modal-info"><strong>장르:</strong> ${genres}</p>
            <p class="modal-info"><strong>평점:</strong> ${stars} (${rating.toFixed(1)})</p>
            <p class="modal-info"><strong>출연:</strong> ${cast}</p>
            <p class="modal-info"><strong>런타임:</strong> ${movie.runtime ? `${movie.runtime}분` : '정보 없음'}</p>
            <h3>줄거리</h3>
            <p class="modal-overview">${movie.overview || '요약 정보가 없습니다.'}</p>
        </div>
    `;
    
    openModal();
}

// 모달 열기
function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
}

// 모달 닫기
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    
    // 현재 주소에 ?movie=ID가 있으면 히스토리 이전 상태로 돌아가기
    if (window.location.search.includes('?movie=')) {
        history.back();
    }
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
