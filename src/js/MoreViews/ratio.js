import {_tr} from '../Helpers/DomApi.js'
import Moreview from './index.js'

export default class Ratio extends Moreview {
    constructor(el) {
        super(el);
        this.store = {idIdx: 0, startIdx: 0, endIdx: 0, totalNum: 0, remainder: null};
        this.initHandler();
    };
    defaultload() {
        const { startEl, endEl, eventEl } = this.el.targets;
        const { additems, addClassName, template } = this.el;
        const eles = _tr(startEl).find(endEl);
        const eventE = document.querySelector(eventEl);
        this.store.remainder = Math.floor((eles.length % additems));

        eles.forEach((ele, idx) => {
            if(idx+1 > additems) {
                ele.classList.add(addClassName);
            }
        });

        this.store.totalNum = Math.floor((eles.length / additems));
        
        if( this.store.remainder === 0) { // additems의 개수 와 아이템의 개수 가 맞아 떨어 졌을 경우
            eventE.innerHTML = template(0, 1, this.store.totalNum)
        }else if(this.store.remainder < additems ){ // additems의 개수보다 아이템의 개수가 작을 경우
            eventE.innerHTML = template(0, 1, this.store.totalNum + 1)
        }  
    };

    activeRatio(item) {
        super.active(item);
        const {startEl, endEl} = this.el.targets;
        let { additems, addClassName, template } = this.el;
        const eles = _tr(startEl).find(endEl);
        const totalIdx = parseInt(item.querySelector('.total').innerHTML);
        let currentIdx = parseInt(item.querySelector('.current').innerHTML);

        if (currentIdx >= totalIdx) return false;
        if(currentIdx >= 2) {
            this.store.startIdx = this.store.endIdx;
        }else{
            this.store.startIdx = additems;
        }
        this.store.endIdx = this.store.startIdx + additems;
        
        eles.forEach((ele, idx) => {
            if((idx >= this.store.startIdx) && (idx < this.store.endIdx)){
                ele.classList.remove(addClassName);
            }     
        });
    
        currentIdx += 1;
        this.store.idIdx += 1;
 
        if( this.store.remainder === 0) { // additems의 개수 와 아이템의 개수 가 맞아 떨어 졌을 경우
            if( currentIdx >= this.store.totalNum) { 
                item.innerHTML = template(this.store.idIdx, currentIdx, totalIdx, addClassName);
                return false;
            }
        }else if(this.store.remainder < additems ){ // additems의 개수보다 아이템의 개수가 작을 경우
            if( currentIdx >= (this.store.totalNum + 1)) { 
                item.innerHTML = template(this.store.idIdx, currentIdx, totalIdx, addClassName);
                return false;
            }
        }
        item.innerHTML = template(this.store.idIdx, currentIdx, totalIdx); 
    };

    initHandler() {
        this.defaultload();
        const { eventEl } = this.el.targets;
        const eventE = document.querySelector(eventEl)

        const handler = (self) => { // 특정 조건에만 실행하는 함수
            this.activeRatio(self)
        };

        (() => { 
            eventE.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                handler(e.currentTarget);
            });
        })();
    };
};