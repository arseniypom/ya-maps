import InteractiveMap from './interactiveMap';
import FakeServer from './fakeServer';
import BalloonTemplate from './templates/balloon.hbs';

class GeoReview {
  constructor() {
    this.formTemplate = BalloonTemplate();
    this.map = new InteractiveMap('map', this.onClick.bind(this));
    this.server = new FakeServer;
    this.map.init().then(this.onInit.bind(this));
  }

  async onInit() {
    const coords = await this.callApi('coords');

    if (Object.keys(coords).length > 0) {
      for (const coord of Object.keys(coords)) {
        this.map.createPlacemark(JSON.parse(coord))
      }
    }

    document.body.addEventListener('click', this.onDocumentClick.bind(this))
  }

  callApi(method, body = {}) {
    if (method === 'coords') {
      return this.server.getCoords()
    } else if (method === 'add') {
      return this.server.addReview(body)
    } else if (method === 'list') {
      return this.server.getList(body)
    }
  }

  createForm(coords, reviews) {
    const root = document.createElement('article');
    root.classList.add('balloon');
    root.innerHTML = this.formTemplate;
    const reviewList = root.querySelector('[data-role=review-list]');
    const reviewForm = root.querySelector('[data-role=review-form]');
    reviewForm.dataset.coords = JSON.stringify(coords);

    if (reviews) {
      for (const item of reviews) {
        console.log(item);
        const review = document.createElement('div');
        review.classList.add('review-item');
        review.innerHTML = `
        <div><b>${item.name}</b>[${item.name}]</div>
        <div>${item.text}</div>
        `
        reviewList.appendChild(review);
      }
    }
    return root;
  }

  async onClick(coords) {
    this.map.openBalloon(coords, 'Загрузка...');
    const list = await this.callApi('list', JSON.stringify(coords));
    const form = this.createForm(coords, list);
    this.map.setBalloonContent(form.innerHTML);
  }

  async onDocumentClick(e) {
    if (e.target.dataset.role === 'review-add') {
      const reviewForm = document.querySelector('[data-role=review-form]');
      const coords = JSON.parse(reviewForm.dataset.coords);

      const data = {
        coords: JSON.stringify(coords),
        review: {
          name: document.querySelector('[data-role=review-name]').value,
          place: document.querySelector('[data-role=review-place]').value,
          text: document.querySelector('[data-role=review-text]').value
        }
      };

      try {
        await this.callApi('add', data);
        this.map.createPlacemark(coords);
        this.map.closeBalloon();
      } catch (error) {
        const formError = document.querySelector('#form-error');
        formError.innerText = error.message;
      }
    }
  }
}

export default GeoReview;