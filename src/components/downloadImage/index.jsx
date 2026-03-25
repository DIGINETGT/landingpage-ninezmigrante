import React, { useState, useEffect } from 'react';

import { Stack, Text, Button, Image } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import folder from '../../assets/folder.png';
import LoadSplash from '../loadSplash';

const DownloadImage = ({
  label,
  containerRef,
  fileName = 'download.pdf',
  onSS = (screenshot) => {},
}) => {
  const waitForNextPaint = () =>
    new Promise((resolve) =>
      window.requestAnimationFrame(() =>
        window.requestAnimationFrame(resolve)
      )
    );

  const waitForImages = async (rootElement) => {
    if (!rootElement) return;

    const images = Array.from(rootElement.querySelectorAll('img'));
    const pendingImages = images.filter((img) => !img.complete);

    await Promise.all(
      pendingImages.map(
        (img) =>
          new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          })
      )
    );
  };

  const collectScrollableNodes = (rootElement) => {
    if (!rootElement) return [];

    const nodes = [rootElement, ...rootElement.querySelectorAll('*')];

    return nodes.reduce((acc, node) => {
      const computed = window.getComputedStyle(node);
      const hasScrollableOverflow =
        ['auto', 'scroll'].includes(computed.overflow) ||
        ['auto', 'scroll'].includes(computed.overflowY) ||
        ['auto', 'scroll'].includes(computed.overflowX);
      const hasLimitedHeight =
        computed.maxHeight !== 'none' || computed.height !== 'auto';
      const canOverflowContent =
        node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth;

      if (hasScrollableOverflow || (hasLimitedHeight && canOverflowContent)) {
        acc.push({
          node,
          style: {
            overflow: node.style.overflow,
            overflowY: node.style.overflowY,
            overflowX: node.style.overflowX,
            maxHeight: node.style.maxHeight,
            height: node.style.height,
          },
        });
      }

      return acc;
    }, []);
  };

  const expandForCapture = (rootElement) => {
    const scrollableNodes = collectScrollableNodes(rootElement);

    scrollableNodes.forEach(({ node }) => {
      node.style.overflow = 'visible';
      node.style.overflowY = 'visible';
      node.style.overflowX = 'visible';
      node.style.maxHeight = 'none';
      node.style.height = 'auto';
      node.scrollTop = 0;
      node.scrollLeft = 0;
    });

    return () => {
      scrollableNodes.forEach(({ node, style }) => {
        node.style.overflow = style.overflow;
        node.style.overflowY = style.overflowY;
        node.style.overflowX = style.overflowX;
        node.style.maxHeight = style.maxHeight;
        node.style.height = style.height;
      });
    };
  };

  // STATE
  const [screenshot, setScreenshot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blur, setBlur] = useState(false);
  const handleDownloadImage = async () => setScreenshot(true);

  // TAKE SCREEN SHOOT
  useEffect(() => {
    if (screenshot) {
      const take = async () => {
        setBlur(true);
        setLoading(true);
        const element = containerRef.current;
        if (!element) {
          onSS(false);
          setLoading(false);
          setScreenshot(false);
          setBlur(false);
          return;
        }

        onSS(true);
        const restoreLayout = expandForCapture(element);

        try {
          await waitForNextPaint();
          await waitForNextPaint();
          if (document.fonts?.ready) {
            await document.fonts.ready;
          }
          await waitForImages(element);

          const captureWidth = Math.ceil(
            Math.max(element.scrollWidth, element.getBoundingClientRect().width)
          );
          const captureHeight = Math.ceil(
            Math.max(
              element.scrollHeight,
              element.getBoundingClientRect().height
            )
          );

          const html2canvas = (await import('html2canvas')).default;
          const canvas = await html2canvas(element, {
            useCORS: true,
            backgroundColor: '#ffffff',
            scale: 2,
            width: captureWidth,
            height: captureHeight,
            windowWidth: captureWidth,
            windowHeight: captureHeight,
          });
          const data = canvas.toDataURL('image/jpeg', 1.0);

          const jsPDF = (await import('jspdf')).default;
          const pdf = new jsPDF({
            unit: 'pt',
            format: [canvas.width, canvas.height],
          });
          const imgProps = pdf.getImageProperties(data);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(data, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          await pdf.save(fileName, { returnPromise: true });
        } finally {
          restoreLayout();
          onSS(false);
          setLoading(false);
          setScreenshot(false);
          setBlur(false);
        }
      };
      take();
    }
  }, [fileName, screenshot]);

  return (
    <>
      {!screenshot ? (
        <Stack
          gap="24px"
          alignItems="center"
          justifyContent="center"
          direction={{ base: 'column', md: 'row' }}
        >
          {label.length > 0 && (
            <>
              <Image src={folder} height="50px" />
              <Text fontFamily="Oswald" fontSize="2xl" textAlign="center">
                {label}
              </Text>
            </>
          )}
          <Button
            size="lg"
            bgColor="#ccc"
            onClick={handleDownloadImage}
            rightIcon={<DownloadIcon />}
            fontFamily="Montserrat Medium"
            _hover={{ bgColor: 'green.700', color: 'white' }}
          >
            Descargar
          </Button>
        </Stack>
      ) : (
        <></>
      )}
      <LoadSplash
        title="Generando infografía..."
        description="Espera un momento, se esta creando el documento para descargar."
        setBlur={blur}
        open={loading}
      />
    </>
  );
};

export default DownloadImage;
