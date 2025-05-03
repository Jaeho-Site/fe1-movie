document.addEventListener('DOMContentLoaded', async () => {
    modalUI.setModalEvents();
    const movies = await movieAPI.fetchMovies(movieAPI.API_URL);
    movieUI.addMovies(movies);
    movieUI.searchButton.addEventListener('click', async () => {
        const searchTerm = movieUI.searchInput.value.trim();
        if (searchTerm) {
            const movies = await movieAPI.fetchMovies(movieAPI.SEARCH_URL + searchTerm);
            movieUI.addMovies(movies);
        } else {
            alert('검색어를 입력해주세요.');
        }
    });
    movieUI.searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const searchTerm = movieUI.searchInput.value.trim();
            if (searchTerm) {
                const movies = await movieAPI.fetchMovies(movieAPI.SEARCH_URL + searchTerm);
                movieUI.addMovies(movies);
            } else {
                alert('검색어를 입력해주세요.');
            }
        }
    });
}); 