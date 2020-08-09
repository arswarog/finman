import React from 'react';
import styled from 'styled-components';
import { ICategory } from '../models/category/category.types';

interface IProp {
    category: ICategory;
    size?: 'default' | 'large';
}

const CategoryIconBox = styled.span`
  display: inline-block;
  border: 2px solid green;
  border-radius: 50%;
  background: url(${process.env.PUBLIC_URL}/category-icons/default.png);
  width: ${props => props.size};
  height: ${props => props.size};
  background-size: 100%;
  box-sizing: content-box;
  
  > span {
    display: block;
    background-size: 100%;
    width: ${props => props.size};
    height: ${props => props.size};
  }
`;

export const CategoryIcon = ({category, size}: IProp) => {
    const icon = category.image || 'default';
    const width = size === 'large' ? '64px' : '32px';
    const style = {
        backgroundImage: `url(${process.env.PUBLIC_URL}/category-icons/${icon}.png)`,
    };
    return (
        <CategoryIconBox size={width}>
            <span style={style}/>
        </CategoryIconBox>
    );
};
