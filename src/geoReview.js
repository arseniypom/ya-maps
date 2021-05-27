import InteractiveMap from './interactiveMap';
import FakeServer from './fakeServer';

class GeoReview {
  constructor() {
    this.formTemplate = document.querySelector('#addFormTemplate').innerHTML;
    this.map = new InteractiveMap('map', this.onClick.bind(this));
    this.server = new FakeServer;
    this.map.init().then(this.onInit.bind(this));
  }

  onInit() {
    const coords = this.callApi('coords');
    if (coords.length > 0) {
      for (const item of coords) {
        for (let i = 0; i < item.total; i++) {
          this.map.createPlacemark(item.coords);
        }
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
    const reviewList = root.querySelector('.review-list');
    const reviewForm = root.querySelector('[data-role=review-form]');
    reviewForm.dataset.coords = JSON.stringify(coords);

    if (reviews) {
      for (const item of reviews) {
        const div = document.createElement('div');
        div.classList.add('review-item');
        div.innerHTML = `
        <div><b>${item.name}</b>[${item.name}]</div>
        <div>${item.text}</div>
        `
        reviewList.appendChild(div);
      }
    }
    return root;
  }

  onClick(coords) {
    this.map.openBalloon(coords, 'Загрузка...');
    const list = this.callApi('list', JSON.stringify(coords));
    const form = this.createForm(coords, list);
    this.map.setBalloonContent(form);
  }

  onDocumentClick(e) {
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
        this.callApi('add', data);
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