// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQCPuTrNZYywEE97QX3LZ3c78Gh1neyfFusgT4OI4ikxgTFuORxmh9LgS3sypwvJfvRCq9TXGrIW8tkQUDpb5zQCHi9h_mFn4-S8f_hIaw4WiYUwJN1T6EcMgHY3bLFK9sahOO2WOoJaN6IvNnpkYa6pg14I73TshO6LvG2W6cWW-MZ5k2Rg1FXh2YqXhTzV-M_SwVElliHh6l848TwftRlhNnqrAV0pC7E9gyceDu4X4ZNbx_aLLRE7JR6T6eq7xEyOVl_cOQdJhFcJK1s5-ggcajAJfmX7tBDAtM_GegtZo0Hymi3cLD57GmNZZTgoyxek';
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

async function getTopTracks(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
  )).items;
}

const topTracks = await getTopTracks();
console.log(
  topTracks?.map(
    ({name, artists}) =>
      `${name} by ${artists.map(artist => artist.name).join(', ')}`
  )
);