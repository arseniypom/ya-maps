export default class FakeServer {
  constructor() {
    this.storage = window.localStorage;
    this.storage.setItem('coords', JSON.stringify({
      '[55.76, 37.64]': [
        {name: 'test', place:'place123', text:'text12345678909876543'}
      ]
    }));
  }

  getCoords() {
    return JSON.parse(this.storage.getItem('coords'));
  }

  getList(coords) {
    let coordsObj = this.getCoords();
    if (Object.keys(coordsObj).includes(coords)) {
      return coordsObj[coords];
    }
  }

  addReview(data) {
    let coordsObj = this.getCoords();
    let newCoordsObj = {};
    if (Object.keys(coordsObj).includes(data.coords)) {
      newCoordsObj = {
        ...coordsObj,
        [data.coords]: [
          ...coordsObj[data.coords],
          data.review
        ]
      }
    } else {
      newCoordsObj = {
        ...coordsObj,
        [data.coords]: [
          data.review
        ]
      }
    }
    this.storage.setItem('coords', JSON.stringify(newCoordsObj));
  }
}