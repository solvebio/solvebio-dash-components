import React from 'react';
import {shallow} from 'enzyme';
import DashS3Uploader from '../DashS3Uploader.react';

describe('DashS3Uploader', () => {

    it('renders', () => {
        const component = shallow(<DashS3Uploader />);
        expect(component).to.be.ok;
    });
});
