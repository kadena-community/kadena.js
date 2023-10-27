import { render, screen } from '@testing-library/react';
import * as ace from 'ace-builds/src-noconflict/ace';
import React from 'react';
import AceViewerComponent from './index';

beforeAll(() => {
  ace.config.set('basePath', './');
});

describe('AceViewerComponent', () => {
  it('renders correctly without code', () => {
    // `mode` is an optional property, but somehow something explodes (when using happy-dom, not jsdom) making this request:
    // "/mode-mode.js","method":"GET","referer":"http://localhost:3000/"
    render(<AceViewerComponent mode="lisp" code="" />);

    // Assert that the AceEditor component is rendered
    const aceEditor = screen.getByRole('textbox');
    expect(aceEditor).toBeInTheDocument();

    // Assert that the AceEditor component has the default props
    expect(aceEditor).toHaveValue('');
  });
});
