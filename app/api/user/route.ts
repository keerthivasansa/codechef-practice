

export const GET = async () => {
    const url = new URL('https://www.codechef.com/recent/user')
    const params = url.searchParams;
    params.set("user_handle", "keerthivasansa");
    params.set("page", "1");
    
    const resp = await fetch(url);

}