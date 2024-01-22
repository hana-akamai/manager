import { styled } from '@mui/material/styles';
import * as React from 'react';
import { ControlProps } from 'react-select';

import { TextField } from 'src/components/TextField';

type Props = ControlProps<any, any>;

const SelectControl: React.FC<Props> = (props) => {
  return (
    <StyledTextField
      InputProps={{
        inputComponent: 'div',
        inputProps: {
          children: props.children,
          className: props.selectProps.classes.input,
          ref: props.innerRef,
          ...props.innerProps,
        },
      }}
      data-qa-enhanced-select={
        props.selectProps.value
          ? props.selectProps.value.label
          : props.selectProps.placeholder
      }
      fullWidth
      {...props.selectProps.textFieldProps}
    />
  );
};

const StyledTextField = styled(TextField, {
  label: 'StyledTextField',
})<Props>(({ theme }) => ({
  '& .MuiInputBase-input': {
    background: `${theme.bg.white} !important`,
  },
  background: theme.bg.white,
}));

export default SelectControl;
