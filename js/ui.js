const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const movieContainer = document.getElementById('movie-container');

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

function createCard(movie) {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie-card');
    movieEl.setAttribute('data-id', movie.id);
    movieEl.innerHTML = `
        <div class="movie-poster">
            <img src="${movie.posterUrl}" alt="${movie.title}">
        </div>
        <div class="movie-info">
            <button class="bookmark-btn">북마크</button>
            <h3 class="movie-title">${movie.title}</h3>
            <p class="movie-rating">${movie.stars} (${movie.rating.toFixed(1)})</p>
            <p class="movie-overview">${movie.shortOverview}</p>
        </div>
    `;
    movieContainer.appendChild(movieEl);
}

async function showMovieDetails(movieId) {
    try {
        const data = await movieAPI.fetchDetails(movieId);
        modalUI.addModal(data); 
        history.pushState({id: movieId}, '', `?movie=${movieId}`);
    } catch (error) {
        alert(error.message || '영화 상세 정보를 가져오는데 실패했습니다.');
    }
}

movieContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('bookmark-btn')) {
        const card = e.target.closest('.movie-card');
        if (card) {
            const movieId = card.getAttribute('data-id');
            if (movieId) {
                let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
                if (!bookmarks.includes(movieId)) {
                    bookmarks.push(movieId);
                    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
                }
            }
        }
        return;
    }
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