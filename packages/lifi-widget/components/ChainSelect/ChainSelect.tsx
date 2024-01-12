/* eslint-disable react/no-array-index-key */
import type { EVMChain } from '@lifi/sdk';
import { Avatar, Box, Skeleton, Tooltip, Typography } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { FormTypeProps } from '../../providers';
import { FormKeyHelper } from '../../providers';
import { maxChainToOrder } from '../../stores';
import { navigationRoutes } from '../../utils';
import { ChainCard, ChainContainer } from './ChainSelect.style';
import { useChainSelect } from './useChainSelect';

export const ChainSelect = ({ formType }: FormTypeProps) => {
  const navigate = useNavigate();
  const {
    chainOrder,
    chains,
    getChains,
    isLoading,
    setChainOrder,
    setCurrentChain,
  } = useChainSelect(formType);
  const [chainId] = useWatch({
    name: [FormKeyHelper.getChainKey(formType)],
  });

  const hasChainInOrderedList = chainOrder.includes(chainId);
  // If we don't have a chain in the ordered chain list we should add it.
  if (!hasChainInOrderedList) {
    setChainOrder(chainId);
  }

  const showAllChains = () => {
    navigate(navigationRoutes[`${formType}Chain`]);
  };

  const chainsToHide = (chains?.length ?? 0) - maxChainToOrder;

  return (
    <ChainContainer>
      {isLoading
        ? Array.from({ length: maxChainToOrder + 1 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width={56}
              height={56}
              sx={{ borderRadius: 1 }}
            />
          ))
        : getChains().map((chain: EVMChain) => (
            <Tooltip
              key={chain.id}
              title={chain.name}
              placement="top"
              enterDelay={400}
              arrow
            >
              <ChainCard
                className='withHover'
                onClick={() => setCurrentChain(chain.id)}
                variant={chainId === chain.id ? 'selected' : 'default'}
              >
                <div style={{display: 'flex', alignItems: 'center'}}>
                <Avatar
                  src={chain.logoURI}
                  alt={chain.key}
                  sx={{ width: '32px', height: '32px', marginRight: '12px' }}
                >
                </Avatar>
                <Typography fontSize={14} fontWeight={500} color={'#C0C1C3'}>
                  {chain.name}
                </Typography>
                </div>
              </ChainCard>
            </Tooltip>
          ))}
      {chainsToHide > 0 ? (
        <ChainCard className='withHover' onClick={showAllChains}>
          <Box
            sx={{
              width: 75,
              height: 18,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Typography fontWeight={500} fontSize={14}>+{chainsToHide} more</Typography>
          </Box>
        </ChainCard>
      ) : null}
    </ChainContainer>
  );
};
