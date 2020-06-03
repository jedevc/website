import mafs

from io import BytesIO

import urllib.request
import urllib.error
import json

def main():
    latest = get_comic()

    fs = mafs.MagicFS()

    @fs.read('/:number', encoding=None)
    def read_comic(path, ps):
        data = get_comic(ps.number)
        if data:
            picture = get_image(data['img'])
            return picture

    @fs.list('/')
    def list_comics(path, ps):
        return (str(i) for i in range(1, latest['num'] + 1))

    @fs.stat('/:number')
    def access_comic(path, ps):
        try:
            if int(ps.number) > latest['num']:
                raise FileNotFoundError()
        except ValueError:
            pass

    fs.run()

comic_cache = {}
def get_comic(comic=None):
    # download comic data if not already stored
    if comic not in comic_cache:
        # calculate url, with default being the latest comic
        if comic:
            url = 'http://xkcd.com/' + str(comic) + '/info.0.json'
        else:
            url = 'http://xkcd.com/info.0.json'

        # download comic data
        try:
            response = urllib.request.urlopen(url)
            comic_cache[comic] = json.loads(response.read())
        except urllib.error.HTTPError:
            return None

    # get cached comic data
    return comic_cache[comic]

image_cache = {}
def get_image(url):
    # download image if not already stored
    if url not in image_cache:
        response = urllib.request.urlopen(url)
        image_cache[url] = response.read()

    # return file-like interface for image data
    return BytesIO(image_cache[url])

if __name__ == '__main__':
    main()
