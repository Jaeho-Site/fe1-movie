// UI 요소들 선택
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const movieContainer = document.getElementById('movie-container');
const modal = document.getElementById('movie-modal');
const modalDetails = document.getElementById('modal-details');
const closeBtn = document.querySelector('.close-btn');

// 영화 목록 표시
function addMovies(movies) {
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
            posterUrl = movieAPI.IMG_URL + poster_path;
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
            createCard(id, title, posterUrl, stars, rating, shortOverview);
        } else {
            // 영어 데이터로 대체
            movieAPI.fetchEnOverview(id)
                .then(data => {
                    let engOverview = '요약이 없습니다.';
                    if (data.overview && data.overview.trim().length > 0) {
                        if (data.overview.length > 100) {
                            engOverview = `${data.overview.substring(0, 100)}...`;
                        } else {
                            engOverview = `${data.overview}`;
                        }
                    }
                    createCard(id, title, posterUrl, stars, rating, engOverview);
                });
        }
    });
}

// 영화 카드 생성
function createCard(id, title, posterUrl, stars, rating, overview) {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie-card');
    movieEl.setAttribute('data-id', id);
    movieEl.innerHTML = `
        <div class="movie-poster">
            <img src="${posterUrl}" alt="${title}">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${title}</h3>
            <p class="movie-rating">${stars} (${rating.toFixed(1)})</p>
            <p class="movie-overview">${overview}</p>
        </div>
    `;
    
    // 카드 클릭 이벤트 - 모달 표시
    movieEl.addEventListener('click', () => {
        showMovieDetails(id);
    });
    
    movieContainer.appendChild(movieEl);
}

// 영화 상세 정보 가져와 표시
function showMovieDetails(movieId) {
    movieAPI.fetchDetails(movieId)
        .then(data => {
            addModal(data);
            // 페이지 히스토리에 상태 추가 (뒤로가기 지원)
            history.pushState({id: movieId}, '', `?movie=${movieId}`);
        })
        .catch(error => {
            alert(error.message || '영화 상세 정보를 가져오는데 실패했습니다.');
        });
}

// 영화 상세 정보 모달에 표시
function addModal(movie) {
    const posterPath = movie.poster_path 
        ? `${movieAPI.IMG_URL}${movie.poster_path}`
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

// 모달 이벤트 리스너 설정
function setModalEvents() {
    // 닫기 버튼 이벤트
    closeBtn.addEventListener('click', closeModal); 
    // 모달 바깥 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    // 브라우저 뒤로가기 처리
    window.addEventListener('popstate', () => {
        if (modal.style.display === 'block') {
            closeModal();
        }
    });
}

const movieUI = {
    addMovies,
    createCard,
    showMovieDetails,
    addModal,
    openModal,
    closeModal,
    setModalEvents,
    searchInput,
    searchButton
}; 