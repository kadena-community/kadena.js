"use client";

import {tokens} from '@kadena/kode-ui/styles';
import { useAppState } from '../../store/selectors';
import styles from './logo.module.css';

export const Icon = ({ width, height, state }: { width: number; height: number; state: string }) => {
  const uxTheme = useAppState((state) => state.ux.theme);

  const blackCubeTopFillToken = uxTheme.mode === 'dark' ? tokens.kda.foundation.color.brand.secondary.n20 : tokens.kda.foundation.color.brand.secondary.n100;
  const blackCubeLeftFillToken = uxTheme.mode === 'dark' ? tokens.kda.foundation.color.brand.secondary.n10 : tokens.kda.foundation.color.brand.secondary.n99;
  const blackCubeRightFillToken = uxTheme.mode === 'dark' ? tokens.kda.foundation.color.brand.secondary.n5 : tokens.kda.foundation.color.brand.secondary.n90;

  const greenCubeRightFillToken = tokens.kda.foundation.color.palette.aqua.n70;
  const greenCubeLeftFillToken = tokens.kda.foundation.color.palette.aqua.n50;
  const greenCubeTopFillToken = tokens.kda.foundation.color.palette.aqua.n30;

  return (
    <svg className={styles.icon}
      xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 58.6 62">
      <g id="wrapper" className={[styles[state]].join(' ')}>
        <g id="hexagons">
          <g id="behind-hexagons">
            <g className={[styles.hexagonGroup, styles.hex1].join(' ')} style={{ transformOrigin: '29.3px 19.7px' }}>
              <polygon style={{ fill: blackCubeTopFillToken }} className={styles.faceTop} points="34.2 16.9 29.3 19.7 24.5 16.9 29.3 14.1 34.2 16.9"/>
              <polygon style={{ fill: blackCubeRightFillToken }} className={styles.faceRight} points="34.2 16.9 34.2 22.5 29.3 25.3 29.3 19.7 34.2 16.9"/>
              <polygon style={{ fill: blackCubeLeftFillToken }} className={styles.faceLeft} points="29.3 19.7 29.3 25.3 24.4 22.5 24.4 16.9 29.3 19.7"/>
            </g>
            <g className={[styles.hexagonGroup,styles.hex6].join(' ')} style={{ transformOrigin: '39.10761px 36.6445px' }}>
              <polygon style={{ fill: blackCubeTopFillToken }} className={styles.faceTop} points="44 33.8 39.1 36.6 34.2 33.8 39.1 31 44 33.8"/>
              <polygon style={{ fill: blackCubeRightFillToken }} className={styles.faceRight} points="44 33.9 44 39.5 39.1 42.3 39.1 36.7 44 33.9"/>
              <polygon style={{ fill: blackCubeLeftFillToken }} className={styles.faceLeft} points="39.1 36.7 39.1 42.3 34.2 39.5 34.2 33.9 39.1 36.7"/>
            </g>
            <g className={[styles.hexagonGroup,styles.hex11].join(' ')} style={{ transformOrigin: '19.54587px 36.63649px' }}>
              <polygon style={{ fill: blackCubeTopFillToken }} className={styles.faceTop} points="24.4 33.8 19.5 36.6 14.7 33.8 19.5 31 24.4 33.8"/>
              <polygon style={{ fill: blackCubeRightFillToken }} className={styles.faceRight} points="24.4 33.9 24.4 39.5 19.6 42.3 19.6 36.7 24.4 33.9"/>
              <polygon style={{ fill: blackCubeLeftFillToken }} className={styles.faceLeft} points="19.5 36.7 19.5 42.3 14.7 39.5 14.7 33.9 19.5 36.7"/>
            </g>
          </g>
          <g id="green-hexagons">
            <g className={[styles.hexagonGroup,styles.hex12].join(' ')} style={{ transformOrigin: '14.7px 39.5px' }}>
              <polygon style={{ fill: greenCubeTopFillToken }} className={styles.greenTop} points="19.5 36.7 14.7 39.5 9.8 36.7 14.7 33.8 19.5 36.7"/>
              <polygon style={{ fill: greenCubeRightFillToken }} className={styles.greenRight} points="19.5 36.7 19.5 42.3 14.7 45.1 14.7 39.5 19.5 36.7"/>
              <polygon style={{ fill: greenCubeLeftFillToken }} className={styles.greenLeft} points="14.6 39.5 14.6 45.1 9.8 42.3 9.8 36.7 14.6 39.5"/>
            </g>
            <g className={[styles.hexagonGroup,styles.hex7].join(' ')} style={{ transformOrigin: '43.99769px 39.46807px' }}>
              <polygon style={{ fill: greenCubeTopFillToken }} className={styles.greenTop} points="48.8 36.7 44 39.5 39.1 36.7 44 33.9 48.8 36.7"/>
              <polygon style={{ fill: greenCubeRightFillToken }} className={styles.greenRight} points="48.9 36.7 48.9 42.3 44 45.1 44 39.5 48.9 36.7"/>
              <polygon style={{ fill: greenCubeLeftFillToken }} className={styles.greenLeft} points="44 39.5 44 45.1 39.1 42.3 39.1 36.7 44 39.5"/>
            </g>
            <g className={[styles.hexagonGroup,styles.hex16].join(' ')} style={{ transformOrigin: '29.32602px 14.05802px' }}>
              <polygon style={{ fill: greenCubeTopFillToken }} className={styles.greenTop} points="34.2 11.3 29.3 14.1 24.5 11.3 29.3 8.5 34.2 11.3"/>
              <polygon style={{ fill: greenCubeRightFillToken }} className={styles.greenRight} points="34.2 11.3 34.2 16.9 29.3 19.7 29.3 14.1 34.2 11.3"/>
              <polygon style={{ fill: greenCubeLeftFillToken }} className={styles.greenLeft} points="29.3 14.1 29.3 19.7 24.4 16.9 24.4 11.3 29.3 14.1"/>
            </g>
          </g>
          <g id="bottom-y">
            <g className={[styles.hexagonGroup,styles.hex9].join(' ')} style={{ transformOrigin: '34.2px 45.1px' }}>
              <polygon style={{ fill: blackCubeTopFillToken }} className={styles.faceTop} points="34.2 45.1 29.3 47.9 24.5 45.1 29.3 42.3 34.2 45.1"/>
              <polygon style={{ fill: blackCubeRightFillToken }} className={styles.faceRight} points="34.2 45.2 34.2 50.8 29.3 53.6 29.3 48 34.2 45.2"/>
              <polygon style={{ fill: blackCubeLeftFillToken }} className={styles.faceLeft} points="29.3 48 29.3 53.6 24.4 50.8 24.4 45.2 29.3 48"/>
            </g>
            <g className={[styles.hexagonGroup,styles.hex10].join(' ')} style={{ transformOrigin: '24.43823px 39.46631px' }}>
              <polygon style={{ fill: blackCubeTopFillToken }} className={styles.faceTop} points="29.3 36.7 24.4 39.5 19.6 36.7 24.4 33.9 29.3 36.7"/>
              <polygon style={{ fill: blackCubeRightFillToken }} className={styles.faceRight} points="29.3 36.7 29.3 42.3 24.4 45.1 24.4 39.5 29.3 36.7"/>
              <polygon style={{ fill: blackCubeLeftFillToken }} className={styles.faceLeft} points="24.4 39.5 24.4 45.1 19.6 42.3 19.6 36.7 24.4 39.5"/>
            </g>
            <g className={[styles.hexagonGroup,styles.hex7].join(' ')} style={{ transformOrigin: '34.21839px 39.46631px' }}>
              <polygon style={{ fill: blackCubeTopFillToken }} className={styles.faceTop} points="39.1 36.7 34.2 39.5 29.3 36.7 34.2 33.9 39.1 36.7"/>
              <polygon style={{ fill: blackCubeRightFillToken }} className={styles.faceRight} points="39.1 36.7 39.1 42.3 34.2 45.1 34.2 39.5 39.1 36.7"/>
              <polygon style={{ fill: blackCubeLeftFillToken }} className={styles.faceLeft} points="34.2 39.5 34.2 45.1 29.3 42.3 29.3 36.7 34.2 39.5"/>
            </g>
            <g className={[styles.hexagonGroup,styles.hex8].join(' ')} style={{ transformOrigin: '29.32831px 42.28913px' }}>
              <polygon style={{ fill: blackCubeTopFillToken }} className={styles.faceTop} points="34.2 39.5 29.3 42.3 24.5 39.5 29.3 36.7 34.2 39.5"/>
              <polygon style={{ fill: blackCubeRightFillToken }} className={styles.faceRight} points="34.2 39.5 34.2 45.1 29.3 47.9 29.3 42.3 34.2 39.5"/>
              <polygon style={{ fill: blackCubeLeftFillToken }} className={styles.faceLeft} points="29.3 42.3 29.3 47.9 24.4 45.1 24.4 39.5 29.3 42.3"/>
            </g>
          </g>
          <g id="right-y">
            <g className={[styles.hexagonGroup,styles.hex5].join(' ')} style={{ transformOrigin: '39.10761px 30.9973px' }}>
              <polygon style={{ fill: blackCubeTopFillToken }} className={styles.faceTop} points="44 28.2 39.1 31 34.2 28.2 39.1 25.4 44 28.2"/>
              <polygon style={{ fill: blackCubeRightFillToken }} className={styles.faceRight} points="44 28.2 44 33.8 39.1 36.6 39.1 31 44 28.2"/>
              <polygon style={{ fill: blackCubeLeftFillToken }} className={styles.faceLeft} points="39.1 31 39.1 36.6 34.2 33.8 34.2 28.2 39.1 31"/>
            </g>
            <g className={[styles.hexagonGroup,styles.hex2].join(' ')} style={{ transformOrigin: '34.21753px 22.52768px' }}>
              <polygon style={{ fill: blackCubeTopFillToken }} className={styles.faceTop} points="39.1 19.7 34.2 22.5 29.3 19.7 34.2 16.9 39.1 19.7"/>
              <polygon style={{ fill: blackCubeRightFillToken }} className={styles.faceRight} points="39.1 19.8 39.1 25.4 34.2 28.2 34.2 22.6 39.1 19.8"/>
              <polygon style={{ fill: blackCubeLeftFillToken }} className={styles.faceLeft} points="34.2 22.6 34.2 28.2 29.3 25.4 29.3 19.8 34.2 22.6"/>
            </g>
            <g className={[styles.hexagonGroup,styles.hex4].join(' ')} style={{ transformOrigin: '43.9977px 22.52768px' }}>
              <polygon style={{ fill: blackCubeTopFillToken }} className={styles.faceTop} points="48.8 19.7 44 22.5 39.1 19.7 44 16.9 48.8 19.7"/>
              <polygon style={{ fill: blackCubeRightFillToken }} className={styles.faceRight} points="48.9 19.8 48.9 25.4 44 28.2 44 22.6 48.9 19.8"/>
              <polygon style={{ fill: blackCubeLeftFillToken }} className={styles.faceLeft} points="44 22.6 44 28.2 39.1 25.4 39.1 19.8 44 22.6"/>
            </g>
            <g className={[styles.hexagonGroup,styles.hex3].join(' ')} style={{ transformOrigin: '39.10761px 25.35049px' }}>
              <polygon style={{ fill: blackCubeTopFillToken }} className={styles.faceTop} points="44 22.5 39.1 25.4 34.2 22.5 39.1 19.7 44 22.5"/>
              <polygon style={{ fill: blackCubeRightFillToken }} className={styles.faceRight} points="44 22.6 44 28.2 39.1 31 39.1 25.4 44 22.6"/>
              <polygon style={{ fill: blackCubeLeftFillToken }} className={styles.faceLeft} points="39.1 25.4 39.1 31 34.2 28.2 34.2 22.6 39.1 25.4"/>
            </g>
          </g>
          <g id="left-y">
            <g className={[styles.hexagonGroup,styles.hex13].join(' ')} style={{ transformOrigin: '19.54645px 30.9973px' }}>
              <polygon style={{ fill: blackCubeTopFillToken }} className={styles.faceTop} points="24.4 28.2 19.5 31 14.7 28.2 19.5 25.4 24.4 28.2"/>
              <polygon style={{ fill: blackCubeRightFillToken }} className={styles.faceRight} points="24.4 28.2 24.4 33.8 19.6 36.6 19.6 31 24.4 28.2"/>
              <polygon style={{ fill: blackCubeLeftFillToken }} className={styles.faceLeft} points="19.5 31 19.5 36.6 14.7 33.8 14.7 28.2 19.5 31"/>
            </g>
            <g className={[styles.hexagonGroup,styles.hex14].join(' ')} style={{ transformOrigin: '14.65637px 22.52768px' }}>
              <polygon style={{ fill: blackCubeTopFillToken }} className={styles.faceTop} points="19.5 19.7 14.7 22.5 9.8 19.7 14.7 16.9 19.5 19.7"/>
              <polygon style={{ fill: blackCubeRightFillToken }} className={styles.faceRight} points="19.5 19.8 19.5 25.4 14.7 28.2 14.7 22.6 19.5 19.8"/>
              <polygon style={{ fill: blackCubeLeftFillToken }} className={styles.faceLeft} points="14.6 22.6 14.6 28.2 9.8 25.4 9.8 19.8 14.6 22.6"/>
            </g>
            <g className={[styles.hexagonGroup,styles.hex15].join(' ')} style={{ transformOrigin: '24.43653px 22.52768px' }}>
              <polygon style={{ fill: blackCubeTopFillToken }} className={styles.faceTop} points="29.3 19.7 24.4 22.5 19.6 19.7 24.4 16.9 29.3 19.7"/>
              <polygon style={{ fill: blackCubeRightFillToken }} className={styles.faceRight} points="29.3 19.8 29.3 25.4 24.4 28.2 24.4 22.6 29.3 19.8"/>
              <polygon style={{ fill: blackCubeLeftFillToken }} className={styles.faceLeft} points="24.4 22.6 24.4 28.2 19.6 25.4 19.6 19.8 24.4 22.6"/>
            </g>
            <g className={[styles.hexagonGroup,styles.hex14].join(' ')} style={{ transformOrigin: '19.54645px 25.35049px' }}>
              <polygon style={{ fill: blackCubeTopFillToken }} className={styles.faceTop} points="24.4 22.5 19.5 25.4 14.7 22.5 19.5 19.7 24.4 22.5"/>
              <polygon style={{ fill: blackCubeRightFillToken }} className={styles.faceRight} points="24.4 22.6 24.4 28.2 19.6 31 19.6 25.4 24.4 22.6"/>
              <polygon style={{ fill: blackCubeLeftFillToken }} className={styles.faceLeft} points="19.5 25.4 19.5 31 14.7 28.2 14.7 22.6 19.5 25.4"/>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
};


export const Logo = ({ width, height }: { width: number; height: number }) => {
  useAppState((state) => state.ux.theme);

  const kadenaLogoTextColorToken = tokens.kda.foundation.color.text.gray.lighter;
  const chainwebEvmLogoTextColorToken = tokens.kda.foundation.color.text.gray.bolder;

  return (
    <svg id="logo" className={styles.logo} xmlns="http://www.w3.org/2000/svg" version="1.1" width={width} height={height} viewBox="0 0 215.1 62">
      <g id="wrapper">
        <g id="chainweb-evm-logo-text">
          <path style={{ fill: chainwebEvmLogoTextColorToken }} className={[styles.title, styles.chainweb].join(' ')} d="M27.4,33.8h-3.6c-.1-.6-.3-1.1-.6-1.6-.3-.5-.6-.9-1-1.2-.4-.3-.9-.6-1.4-.7-.5-.2-1.1-.2-1.7-.2-1.1,0-2,.3-2.9.8-.8.5-1.5,1.3-2,2.4-.5,1-.7,2.3-.7,3.8s.2,2.8.7,3.8c.5,1,1.1,1.8,2,2.3.8.5,1.8.8,2.8.8s1.1,0,1.7-.2c.5-.2,1-.4,1.4-.7.4-.3.8-.7,1.1-1.1.3-.5.5-1,.6-1.5h3.6c-.1,1-.4,1.8-.9,2.7-.4.8-1,1.6-1.8,2.2-.7.6-1.6,1.1-2.5,1.5s-2,.5-3.2.5c-1.7,0-3.3-.4-4.7-1.2-1.4-.8-2.4-2-3.2-3.5-.8-1.5-1.2-3.3-1.2-5.5s.4-4,1.2-5.5,1.9-2.7,3.2-3.5c1.4-.8,2.9-1.2,4.6-1.2s2.1.2,3.1.5c.9.3,1.8.8,2.5,1.4.7.6,1.4,1.3,1.8,2.2.5.9.8,1.8.9,2.9Z"/>
          <path style={{ fill: chainwebEvmLogoTextColorToken }} className={[styles.title, styles.chainweb].join(' ')} d="M34,38.2v8.7h-3.5v-19.8h3.4v7.5h.2c.3-.8.9-1.5,1.6-2,.7-.5,1.7-.7,2.8-.7s1.9.2,2.7.6c.8.4,1.4,1.1,1.8,1.9.4.8.6,1.8.6,3v9.4h-3.5v-8.9c0-1-.3-1.8-.8-2.3-.5-.6-1.2-.8-2.1-.8s-1.2.1-1.7.4c-.5.3-.9.7-1.1,1.2-.3.5-.4,1.1-.4,1.8h0Z"/>
          <path style={{ fill: chainwebEvmLogoTextColorToken }} className={[styles.title, styles.chainweb].join(' ')} d="M51.5,47.2c-.9,0-1.8-.2-2.5-.5-.8-.3-1.3-.8-1.8-1.5-.4-.7-.7-1.5-.7-2.5s.2-1.5.5-2.1c.3-.5.7-1,1.3-1.3.5-.3,1.1-.6,1.8-.7.7-.2,1.4-.3,2.1-.4.9,0,1.6-.2,2.1-.2.5,0,.9-.2,1.2-.3.2-.2.4-.4.4-.7h0c0-.8-.2-1.3-.6-1.7-.4-.4-1.1-.6-1.9-.6s-1.5.2-2,.6c-.5.4-.8.8-1,1.3l-3.3-.5c.3-.9.7-1.7,1.3-2.3.6-.6,1.3-1.1,2.2-1.4.9-.3,1.8-.5,2.8-.5s1.4,0,2.1.3c.7.2,1.4.4,1.9.8.6.4,1.1.9,1.4,1.6.4.7.5,1.5.5,2.5v9.9h-3.4v-2h-.1c-.2.4-.5.8-.9,1.2-.4.4-.9.6-1.4.9-.6.2-1.3.3-2,.3h0ZM52.4,44.7c.7,0,1.3-.1,1.8-.4.5-.3.9-.7,1.2-1.1s.4-1,.4-1.5v-1.7c-.1,0-.3.2-.6.3-.3,0-.6.1-.9.2-.3,0-.6.1-1,.2-.3,0-.6,0-.8.1-.5,0-1,.2-1.4.3-.4.2-.7.4-1,.7-.2.3-.4.7-.4,1.1,0,.6.2,1.1.7,1.5.5.3,1.1.5,1.8.5Z"/>
          <path style={{ fill: chainwebEvmLogoTextColorToken }} className={[styles.title, styles.chainweb].join(' ')} d="M64.5,30c-.6,0-1-.2-1.4-.6-.4-.4-.6-.8-.6-1.3s.2-1,.6-1.3c.4-.4.9-.6,1.4-.6s1,.2,1.4.6c.4.4.6.8.6,1.3s-.2,1-.6,1.3c-.4.4-.9.6-1.4.6ZM62.7,46.9v-14.8h3.5v14.8h-3.5Z"/>
          <path style={{ fill: chainwebEvmLogoTextColorToken }} className={[styles.title, styles.chainweb].join(' ')} d="M73.3,38.2v8.7h-3.5v-14.8h3.3v2.5h.2c.3-.8.9-1.5,1.6-2,.8-.5,1.7-.7,2.8-.7s1.9.2,2.7.7c.8.4,1.4,1.1,1.8,1.9.4.8.6,1.8.6,3v9.4h-3.5v-8.9c0-1-.3-1.8-.8-2.3-.5-.6-1.2-.8-2.1-.8s-1.2.1-1.6.4c-.5.3-.8.7-1.1,1.2-.3.5-.4,1.1-.4,1.8h0Z"/>
          <path style={{ fill: chainwebEvmLogoTextColorToken }} className={[styles.title, styles.chainweb].join(' ')} d="M89.3,46.9l-4.2-14.8h3.6l2.6,10.4h.1l2.7-10.4h3.5l2.7,10.4h.1l2.6-10.4h3.6l-4.2,14.8h-3.6l-2.8-10h-.2l-2.8,10h-3.7Z"/>
          <path style={{ fill: chainwebEvmLogoTextColorToken }} className={[styles.title, styles.chainweb].join(' ')} d="M121.8,39.4c0-1.3-.2-2.4-.5-3.4-.4-.9-.9-1.7-1.5-2.3-.6-.6-1.3-1.1-2.2-1.4-.8-.3-1.7-.4-2.6-.4-1.4,0-2.6.3-3.7,1-1.1.6-1.9,1.5-2.4,2.7-.6,1.2-.9,2.5-.9,4s.3,2.9.9,4c.6,1.1,1.4,2,2.5,2.6,1.1.6,2.4.9,3.8.9s2.2-.2,3.1-.5c.9-.4,1.6-.8,2.2-1.5.6-.6,1-1.4,1.2-2.3l-3.3-.4c-.2.4-.4.8-.7,1.1-.3.3-.7.5-1.1.6-.4.1-.9.2-1.4.2-.8,0-1.4-.2-2-.5-.6-.3-1-.8-1.3-1.4-.3-.6-.5-1.3-.5-2.1h10.3v-1.1h0ZM111.5,38.1c0-.6.2-1.1.5-1.6.3-.6.7-1,1.3-1.4.5-.3,1.2-.5,1.9-.5s1.3.2,1.8.5c.5.3.9.7,1.2,1.2.3.5.4,1.1.4,1.8,0,0-7,0-7,0Z"/>
          <path style={{ fill: chainwebEvmLogoTextColorToken }} className={[styles.title, styles.chainweb].join(' ')} d="M124.7,46.9v-19.8h3.5v7.4h.1c.2-.4.4-.7.8-1.2.3-.4.8-.8,1.3-1.1.6-.3,1.3-.4,2.1-.4s2.2.3,3.1.9c.9.6,1.7,1.4,2.2,2.6.5,1.1.8,2.5.8,4.2s-.3,3-.8,4.2c-.5,1.1-1.3,2-2.2,2.6s-2,.9-3.1.9-1.6-.1-2.1-.4c-.6-.3-1-.6-1.3-1-.3-.4-.6-.8-.8-1.1h-.2v2.3h-3.4ZM128.1,39.5c0,1,.1,1.8.4,2.5.3.7.7,1.3,1.2,1.7.5.4,1.1.6,1.9.6s1.4-.2,1.9-.6.9-1,1.2-1.7c.3-.7.4-1.6.4-2.5s-.1-1.7-.4-2.5c-.3-.7-.7-1.3-1.2-1.7-.5-.4-1.2-.6-2-.6s-1.4.2-1.9.6c-.5.4-.9.9-1.2,1.7-.3.7-.4,1.5-.4,2.5Z"/>
        </g>
        <g id="chainweb-evm-logo-evm-text">
          <path style={{ fill: chainwebEvmLogoTextColorToken }} className={[styles.title, styles.evm].join(' ')} d="M148.6,46.9v-19.8h12.9v3h-9.3v5.4h8.6v3h-8.6v5.4h9.4v3s-12.9,0-12.9,0Z"/>
          <path style={{ fill: chainwebEvmLogoTextColorToken }} className={[styles.title, styles.evm].join(' ')} d="M167.8,27.1l5.1,15.6h.2l5.1-15.6h3.9l-7,19.8h-4.4l-7-19.8h3.9Z"/>
          <path style={{ fill: chainwebEvmLogoTextColorToken }} className={[styles.title, styles.evm].join(' ')} d="M184.7,27.1h4.4l5.9,14.3h.2l5.9-14.3h4.4v19.8h-3.4v-13.6h-.2l-5.5,13.5h-2.6l-5.5-13.6h-.2v13.6h-3.4v-19.8Z"/>
        </g>
        <g id="kadena-logo-text">
          <path style={{ fill: kadenaLogoTextColorToken }} className={styles.kadena} d="M9.9,22.4v-7.3h1.1v3h.2c.5-.5,1.3-1.5,2.7-3h1.5c-.5.6-1.6,1.8-3.3,3.6.6.6,1.7,1.8,3.4,3.7h-1.5c-.5-.5-1.4-1.5-2.8-3.1h-.2v3.1h-1.1,0Z"/>
          <path style={{ fill: kadenaLogoTextColorToken }} className={styles.kadena} d="M15.7,22.4c.3-1.2,1-3.6,2.1-7.3h2c.3,1.2,1,3.6,2.1,7.3h-1.2c0-.3-.2-.9-.5-1.7h-2.8c0,.3-.2.9-.5,1.7h-1.2ZM17.7,19.6h2.3c-.2-.6-.5-1.9-1-3.8h-.2c-.2.6-.5,1.9-1,3.8h0Z"/>
          <path style={{ fill: kadenaLogoTextColorToken }} className={styles.kadena} d="M22.5,22.4v-7.3h2.9c1,0,1.7.2,2.2.7.5.5.8,1.2.8,2.2v1.4c0,1-.3,1.7-.8,2.2-.5.5-1.2.7-2.2.7h-2.9s0,0,0,0ZM23.7,21.3h1.8c.6,0,1.1-.2,1.4-.5.3-.3.5-.8.5-1.4v-1.4c0-.6-.2-1.1-.5-1.4-.3-.3-.8-.5-1.4-.5h-1.8s0,5.2,0,5.2Z"/>
          <path style={{ fill: kadenaLogoTextColorToken }} className={styles.kadena} d="M29.7,22.4v-7.3h4.6v1h-3.4v2.1h3.2v1h-3.2v2.1h3.5v1h-4.6s0,0,0,0Z"/>
          <path style={{ fill: kadenaLogoTextColorToken }} className={styles.kadena} d="M35.5,22.4v-7.3h2.2c.3,1.1,1,3.3,2,6.5h.2v-6.5h1.1v7.3h-2.2c-.3-1.1-1-3.3-2-6.5h-.2v6.5h-1.1Z"/>
          <path style={{ fill: kadenaLogoTextColorToken }} className={styles.kadena} d="M41.8,22.4c.3-1.2,1-3.6,2.1-7.3h2c.3,1.2,1,3.6,2.1,7.3h-1.2c0-.3-.2-.9-.5-1.7h-2.8c0,.3-.2.9-.5,1.7,0,0-1.2,0-1.2,0ZM43.7,19.6h2.3c-.2-.6-.5-1.9-1-3.8h-.2c-.2.6-.5,1.9-1,3.8h0Z"/>
        </g>
      </g>
    </svg>
  )
}
