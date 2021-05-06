import { _tr } from '../Helpers/DomApi.js';
import { anis } from '../Helpers/common.js';
import Actives from '../Helpers/basic.js';

export default class Accordions extends Actives {
  /**
    * @param {Options | object}
    * @example
    * new tr.Accordions ({
        targets: '.item',
        event: 'click', // 이벤트 mouseenter와, click 2가지를 옵션으로 넣을수 있습니다.
        firstItemActive: true, // 첫번째 아이템을 활성화 할건지 여부체크 true or false
        addClassName: 'active',
        duration: 0.4, // 활성화되는 시간을 컨트롤 할수 있습니다.(기본 값으로 0.4초를 가지고 있습니다.)
        autoplay: 1000, // 각각의 리스트를 자동으로 플레이를 시키고, 몇초 간격으로 할것인지 설정할수 있습니다.(autoplay property key가 없다면 자동플레이는 실행되지 않는다.)
        additems: 5, // 자동플레이 항목 객수를 제안 할수 있습니다.
        loop: false, // autoplay를 무한 반복 시킬것인지 여부체크 true or false (기본 값으로 false)
      });
    */
  constructor(el) {
    super(el);
    this.el = el;
    this.store = { ele: null, eleSib: null, self: null, controlEvent: null, firstItem: null, curIdx: 0 };
    this.autoplay = el;
    this.initHandler();
  }

  get autoplay() {
    return this._autoplay;
  }

  set autoplay(value) {
    const {firstItemActive} = this.el;
    if(value.autoplay && firstItemActive){
      throw Error('The autoplay and firstItemActive options cannot be activated together. To run autoplay, you need to do firstItemActive: false.');
    }
  }

  /**
   * Actives클래스의 오버라이딩 (활성화 관한 메소드).
   * @type {DOM}
   * @param {event | current}
   */
  active(item) {
    const { duration } = this.el;

    anis(item, duration, { height: 'auto' });
    this.current = _tr(item)
  }

  /**
   * Actives클래스의 오버라이딩 (비활성화 관한 메소드).
   * @type {DOM}
   * @param {event | current}
   */
  unactive(item) {
    const { duration } = this.el;

    this.current && anis(item, duration, { height: '0' });
  }

  /** 특정 조건에만 실행하는 메소드. */
  initHandler() {
    const { targets, event, firstItemActive, autoplay, additems, loop } = this.el;

    const items = _tr(targets).find('.tr_item');
    this.store.eleSib = items.siblings().find('.tr_acc_box');
    this.store.ele = items.find('.tr_acc_box');

    const setAutoplay = () => {
      super.autoplay({ targets: this.store.ele, duration: autoplay, loop: loop }, i => {
        if (this.store.controlEvent) return false;
        if('additems' in this.el) {
          // 자동플레이 항목 객수를 제안합니다.
          additems - 1 >= i && (this.unactive(this.store.eleSib), this.active(this.store.ele[i]))
        } else {
          // 자동플레이 항목 객수를 제안하지 않습니다.
          this.unactive(this.store.eleSib); 
          this.active(this.store.ele[i]);
        }
        
        // 자동플레이 되면서 addClassName 추가 및 삭제 됩니다.
        super.unactive(items.siblings()); 
        super.active(items[i])
      });
    }

    /**  이벤트 핸들러 */
    items.reduce((acc, cur) => {
      cur.addEventListener(event, e => {
        e.preventDefault(); e.stopPropagation();
        this.store.controlEvent = true;

        const _selfSib = _tr(e.currentTarget).siblings().find('.tr_acc_box');
        const _self = _tr(e.currentTarget).find('.tr_acc_box');

        this.unactive(_selfSib);
        this.active(_self);

        super.unactive(_tr(e.currentTarget).siblings());
        super.active(e.currentTarget);
      });
    }, 0);

    if ('autoplay' in this.el) {
      this.store.eleSib.css('height', 0);
      setAutoplay();
    } else {
      this.store.curIdx = 0;
    }

    firstItemActive && (this.active(this.store.ele[0]), this.store.eleSib.css('height', 0));
    this.store.eleSib.css('height', 0);
  }
}
