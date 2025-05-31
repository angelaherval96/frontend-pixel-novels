export default class NovelService{
    
    static async obtenerNovelas(){ //Datos que se obtendrán de la BD
        const url = 'http://127.0.0.1:8000/api/novels';
        const response = await fetch(url, {
            method: 'GET',
            headers:{
                'Accept': 'application/json' //Siempre que sea un json
            }
        })
        if (!response.ok) throw new Error('Error al obtener las novelas');
        const data = await response.json();
        return data;
    } 
}
 
