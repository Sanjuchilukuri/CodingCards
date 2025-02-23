import Api from "../Api/Api";


export async function get(url: string, params: { [k: string]: string } ){
    return (await Api.get(url,{
        params:params
    })).data;
}
