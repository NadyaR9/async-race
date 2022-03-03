class Service {
  getResource = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
    }
    return {
      response: await res.json(),
      count: res.headers.get('X-Total-Count'),
    };
  };
}

export default Service;
