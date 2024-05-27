import React, { Children, cloneElement, ReactNode, ReactElement } from 'react';

import { BooleanPredicate, PredicateParams, TriggerEvent } from '../types';
import { Item } from './Item';
import { debug } from 'console';

export function isFn(v: any): v is Function {
  return typeof v === 'function';
}

export function isStr(v: any): v is String {
  return typeof v === 'string';
}

export function cloneItems(
  children: ReactNode,
  props: { triggerEvent: TriggerEvent; propsFromTrigger?: object }
): ReactElement<any, string | React.JSXElementConstructor<any>>[] {
  let items: ReactElement<any, string | React.JSXElementConstructor<any>>[] = [];
  if (!Array.isArray(children)) {
    children = [children];
  }
  for(const item of children) {
    // remove null item
    if(!item) {
      continue;
    }
    console.log(item.type)
    if(item.type === Item || !item.props.children) {
      items.push(cloneElement(item as ReactElement<any>, props)); 
    } else {
      let grandchildren = cloneItems(item.props.children, props);
      let newItem = cloneElement(item as ReactElement<any>, {children: grandchildren});
      items.push(newItem); 
    }
  }
  return items;
}

export function getMousePosition(e: TriggerEvent) {
  const pos = {
    x: (e as MouseEvent).clientX,
    y: (e as MouseEvent).clientY,
  };

  const touch = (e as TouchEvent).changedTouches;

  if (touch) {
    pos.x = touch[0].clientX;
    pos.y = touch[0].clientY;
  }

  if (!pos.x || pos.x < 0) pos.x = 0;

  if (!pos.y || pos.y < 0) pos.y = 0;

  return pos;
}

export function getPredicateValue(
  predicate: BooleanPredicate,
  payload: PredicateParams
) {
  return isFn(predicate) ? predicate(payload) : predicate;
}
