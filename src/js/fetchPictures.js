import axios from 'axios';
export { fetchPictures };

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '33320021-cdc1c826e22c035744437b643';

async function fetchPictures(query, page, perPage) {
    try {
        const response = await axios.get(
        `${BASE_URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
        );
        return response;
        
    }
    catch (error) {
        console.log(error);
    }
}