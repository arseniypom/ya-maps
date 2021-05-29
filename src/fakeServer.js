export default class FakeServer {
  constructor() {
    this.storage = window.localStorage;
  }

  getCoords() {
    return JSON.parse(this.storage.getItem('coords'));
  }

  async getList(coords) {
    let coordsObj = await this.getCoords();
    if (Object.keys(coordsObj).includes(coords)) {
      // console.log(coordsObj[coords]);
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
    return {}
  }
}