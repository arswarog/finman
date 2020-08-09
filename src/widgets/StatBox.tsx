import React from 'react';
import styled from 'styled-components';
import { MoneyView } from '../components/MoneyView';
import { Icon } from '../ui-kit/Icon';
import { Money } from '../models/money/money.class';

const StatBoxContainer = styled.div`
  background: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.09);
  border-radius: 10px;
  padding: 12px 12px;
  
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  gap: 12px 12px;
  grid-template-areas: "icon amount amount" "title title status";

  .amount { 
    grid-area: amount; 
    text-align: right;
    
    align-self: center;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1em;
    color: #27173E;
    
    white-space: nowrap;
  }
  
  .icon-wrapper { 
    grid-area: icon;
    text-align: left;
    
    background: #6236FF;
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    color: #fff;
    font-size: 24px;
  }
  
  .title { 
    grid-area: title;
    text-align: left;
    
    font-size: 13px;
    color: #958d9e;
    font-weight: 500;
    display: block;
    line-height: 1em;
    align-self: end;
  }
  
  .status { 
    grid-area: status;
    text-align: right; 
    
    //font-size: 13px;
    color: #958d9e;
    font-weight: 500;
    display: block;
    line-height: 1em;
    align-self: end;
  }
`;

export enum BarColor {
    Neutral = 'neutral',
    Good = 'good',
    Normal = 'normal',
    Bad = 'bad',
}

export interface IQuickDetailsItem {
    amount: Money;
    progress: number;
    color: BarColor;
}

export interface IQuickDetailsItemProps extends IQuickDetailsItem {
    title: string;
    icon: string;
}

export const StatBox = ({title, amount, icon, color, progress}: IQuickDetailsItemProps) => {
    const percent = progress === null
        ? ''
        : progress < 0
            ? progress + '%'
            : '+' + progress + '%';
    return (
        <StatBoxContainer>
            <div className="icon-wrapper">
                <Icon icon={icon}/>
            </div>
            <div className="amount"><MoneyView money={amount}/></div>
            <div className="title">{title}</div>
            <div className="status">{percent}</div>
        </StatBoxContainer>
    );
};
