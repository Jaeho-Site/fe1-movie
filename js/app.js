// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', async () => {
    // 모달 관련 이벤트 설정
    modalUI.setModalEvents();
    // 인기 영화 데이터 로드
    const movies = await movieAPI.fetchMovies(movieAPI.API_URL);
    movieUI.addMovies(movies);
    
    // 검색 버튼 이벤트 리스너
    movieUI.searchButton.addEventListener('click', async () => {
        const searchTerm = movieUI.searchInput.value.trim();
        if (searchTerm) {
            const movies = await movieAPI.fetchMovies(movieAPI.SEARCH_URL + searchTerm);
            movieUI.addMovies(movies);
        } else {
            alert('검색어를 입력해주세요.');
        }
    });
    
    // 엔터 키로 검색 실행
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