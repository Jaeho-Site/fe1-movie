// UI 요소들 선택
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const movieContainer = document.getElementById('movie-container');

// 영화 목록 표시
function addMovies(movies) {
    movieContainer.innerHTML = '';

    if (!movies || movies.length === 0) {
        movieContainer.innerHTML = '<p>검색 결과가 없습니다.</p>';
        return;
    }

    movies.forEach(movie => {
        createCard(movie);
    });
}

// 영화 카드 생성
function createCard(movie) {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie-card');
    movieEl.setAttribute('data-id', movie.id);
    movieEl.innerHTML = `
        <div class="movie-poster">
            <img src="${movie.posterUrl}" alt="${movie.title}">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <p class="movie-rating">${movie.stars} (${movie.rating.toFixed(1)})</p>
            <p class="movie-overview">${movie.shortOverview}</p>
        </div>
    `;
    // 개별 카드에 이벤트 리스너 제거 (이벤트 위임 적용)
    movieContainer.appendChild(movieEl);
}

// 영화 상세 정보 가져와 표시
function showMovieDetails(movieId) {
    movieAPI.fetchDetails(movieId)
        .then(data => {
            modalUI.addModal(data); // modal.js의 함수 사용
            // 페이지 히스토리에 상태 추가 (뒤로가기 지원)
            history.pushState({id: movieId}, '', `?movie=${movieId}`);
        })
        .catch(error => {
            alert(error.message || '영화 상세 정보를 가져오는데 실패했습니다.');
        });
}

movieContainer.addEventListener('click', function(e) {
    let card = e.target.closest('.movie-card');
    if (card && movieContainer.contains(card)) {
        const movieId = card.getAttribute('data-id');
        if (movieId) {
            showMovieDetails(movieId);
        }
    }
});

const movieUI = {
    addMovies,
    createCard,
    showMovieDetails,
    searchInput,
    searchButton
}; 