(async function() {
    console.log('🚀 Starting Instagram DM message deletion...');
    console.log('📍 Deleting messages from bottom to top');
    let deletedCount = 0;
    let attempts = 0;
    const maxAttempts = 500;
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    function scrollToBottom() {
        const messageContainer = document.querySelector('div[data-virtualized="false"]') || 
                               document.querySelector('div[role="main"]') ||
                               document.body;
        if (messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
        window.scrollTo(0, document.body.scrollHeight);
    }
    
    async function findAndClickThreeDots(messageContainer) {
        console.log('🔍 Looking for three dots button...');
        const messageElement = messageContainer.querySelector('div[role="button"][aria-label*="Double tap"]') ||
                             messageContainer.querySelector('div[id*="mid."]') ||
                             messageContainer.querySelector('div[role="button"]');
        if (!messageElement) {
            console.log('❌ Message element not found');
            return null;
        }
        const mouseEvents = ['mousemove', 'mouseenter', 'mouseover'];
        for (let eventType of mouseEvents) {
            messageElement.dispatchEvent(new MouseEvent(eventType, { 
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: messageElement.getBoundingClientRect().left + 10,
                clientY: messageElement.getBoundingClientRect().top + 10
            }));
        }
        await delay(1200);
        const svgButtons = document.querySelectorAll('div[role="button"] svg, button svg');
        for (let svg of svgButtons) {
            const circles = svg.querySelectorAll('circle');
            if (circles.length === 3) {
                const button = svg.closest('div[role="button"]') || svg.closest('button');
                if (button) {
                    const rect = button.getBoundingClientRect();
                    const msgRect = messageElement.getBoundingClientRect();
                    if (rect.top >= msgRect.top - 50 && rect.top <= msgRect.bottom + 50) {
                        console.log('✅ Three dots found (SVG with 3 circles)');
                        return button;
                    }
                }
            }
        }
        const buttons = document.querySelectorAll('div[role="button"], button');
        for (let btn of buttons) {
            const ariaLabel = btn.getAttribute('aria-label') || '';
            if (ariaLabel.includes('more options') || 
                ariaLabel.includes('daha fazla seçenek') ||
                ariaLabel.includes('więcej opcji') ||
                ariaLabel.includes('plus d\'options') ||
                ariaLabel.includes('更多选项') ||
                ariaLabel.includes('その他のオプション') ||
                ariaLabel.includes('Detaylar ve Eylemler')) {
                console.log('✅ Three dots found (aria-label)');
                return btn;
            }
        }
        const allButtons = document.querySelectorAll('div[role="button"]:not([aria-hidden="true"])');
        const msgRect = messageElement.getBoundingClientRect();
        for (let btn of allButtons) {
            const rect = btn.getBoundingClientRect();
            const svg = btn.querySelector('svg');
            if (svg && rect.width < 60 && rect.height < 60 && 
                rect.top >= msgRect.top - 30 && rect.top <= msgRect.bottom + 30 &&
                rect.left >= msgRect.right - 100 && rect.left <= msgRect.right + 50) {
                const viewBox = svg.getAttribute('viewBox');
                if (viewBox && viewBox.includes('24')) {
                    console.log('✅ Three dots found (SVG + position)');
                    return btn;
                }
            }
        }
        const visibleButtons = Array.from(document.querySelectorAll('div[role="button"]'))
            .filter(btn => {
                const style = window.getComputedStyle(btn);
                return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
            });
        
        for (let btn of visibleButtons) {
            const rect = btn.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && rect.width < 50 && rect.height < 50 &&
                rect.top >= msgRect.top - 40 && rect.top <= msgRect.bottom + 40 &&
                rect.left >= msgRect.right - 80) {
                const svg = btn.querySelector('svg');
                if (svg) {
                    console.log('✅ Three dots found (visible + small SVG)');
                    return btn;
                }
            }
        }
        
        const menuButtons = document.querySelectorAll('div[aria-haspopup="menu"], div[aria-expanded="false"]');
        for (let btn of menuButtons) {
            if (btn.getAttribute('role') === 'button') {
                const rect = btn.getBoundingClientRect();
                if (rect.top >= msgRect.top - 30 && rect.top <= msgRect.bottom + 30 &&
                    rect.left >= msgRect.right - 80) {
                    console.log('✅ Three dots found (menu button)');
                    return btn;
                }
            }
        }
        console.log('❌ Three dots button not found');
        return null;
    }
    
    async function clickThreeDots(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        element.style.pointerEvents = 'auto';
        element.style.visibility = 'visible';
        try { 
            element.focus(); 
        } catch(e) {
            console.log('Focus error:', e.message);
        }
        await delay(100);
        element.click();
        await delay(500);
        function checkMenuOpen() {
            const menuSelectors = [
                'div[role="menu"]',
                'div[role="menuitem"]',
                'div[aria-haspopup="true"]',
                'div[data-testid*="menu"]',
                '[role="dialog"]',
                'div[style*="position: fixed"]',
                'div[style*="z-index"]'
            ];
            for (let selector of menuSelectors) {
                const menu = document.querySelector(selector);
                if (menu) {
                    const rect = menu.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        return true;
                    }
                }
            }
            const allElements = document.querySelectorAll('*');
            for (let el of allElements) {
                const text = el.textContent?.toLowerCase() || '';
                if ((text.includes('unsend') || 
                     text.includes('delete message') ||
                     text.includes('gönderimi geri al') ||
                     text.includes('mesajı geri al') ||
                     text.includes('geri al') ||
                     text.includes('supprimer') ||
                     text.includes('eliminar') ||
                     text.includes('löschen') ||
                     text.includes('削除') ||
                     text.includes('удалить')) && 
                    text.length < 50) {
                    const rect = el.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        console.log(`✅ Menu detected - "${text}" found`);
                        return true;
                    }
                }
            }
            return false;
        }
        if (checkMenuOpen()) {
            console.log('✅ Menu opened (simple click)');
            return true;
        }
        const events = [
            new MouseEvent('mouseenter', { bubbles: true, cancelable: true }),
            new MouseEvent('mouseover', { bubbles: true, cancelable: true }),
            new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY,
                button: 0
            }),
            new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY,
                button: 0
            }),
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY,
                button: 0
            })
        ];
        for (let event of events) {
            element.dispatchEvent(event);
            await delay(100);
        }
        await delay(500);
        if (checkMenuOpen()) {
            console.log('✅ Menu opened (mouse events)');
            return true;
        }
        try {
            const touch = new Touch({
                identifier: 1,
                target: element,
                clientX: centerX,
                clientY: centerY,
                radiusX: 2.5,
                radiusY: 2.5,
                rotationAngle: 10,
                force: 0.5,
            });
            element.dispatchEvent(new TouchEvent('touchstart', {
                bubbles: true,
                cancelable: true,
                touches: [touch]
            }));
            await delay(50);
            element.dispatchEvent(new TouchEvent('touchend', {
                bubbles: true,
                cancelable: true,
                touches: []
            }));
            await delay(500);
            if (checkMenuOpen()) {
                console.log('✅ Menu opened (touch events)');
                return true;
            }
        } catch (touchError) {
            console.log('Touch event error (normal):', touchError.message);
        }
        const keyEvents = [
            new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }),
            new KeyboardEvent('keydown', { key: ' ', keyCode: 32, bubbles: true }),
            new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true })
        ];
        for (let keyEvent of keyEvents) {
            element.dispatchEvent(keyEvent);
            await delay(300);
            if (checkMenuOpen()) {
                console.log('✅ Menu opened (keyboard)');
                return true;
            }
        }
        await delay(1000);
        if (checkMenuOpen()) {
            console.log('✅ Menu found open (final check)');
            return true;
        }
        console.log('❌ Could not open menu');
        return false;
    }
    
    async function simpleClick(element) {
        console.log('🖱️ Performing simple click...');
        element.click();
        await delay(200);
    }
    
    async function deleteMessages() {
        scrollToBottom();
        await delay(2000);
        while (attempts < maxAttempts) {
            attempts++;
            console.log(`\n🔄 Attempt #${attempts}`);
            const myMessageContainers = [];
            const sentIndicators = [
                'You sent',
                'Sen gönderdin',
                'Du hast gesendet',
                'Vous avez envoyé',
                'Enviaste',
                'Hai inviato',
                '你发送了',
                'あなたが送信',
                'Вы отправили',
                'Wysłałeś'
            ];
            const allElements = document.querySelectorAll('*');
            allElements.forEach(element => {
                const text = element.textContent?.trim() || '';
                if (sentIndicators.some(indicator => text === indicator)) {
                    let messageContainer = element;
                    for (let i = 0; i < 15; i++) {
                        messageContainer = messageContainer.parentElement;
                        if (!messageContainer) break;
                        if (messageContainer.querySelector('div[role="button"][aria-label*="Double tap"]') ||
                            messageContainer.querySelector('div[id*="mid."]')) {
                            myMessageContainers.push(messageContainer);
                            break;
                        }
                    }
                }
            });
            if (myMessageContainers.length === 0) {
                console.log('✅ No messages to delete found. Operation completed!');
                break;
            }
            const lastMessage = myMessageContainers[myMessageContainers.length - 1];
            console.log(`📍 Found ${myMessageContainers.length} messages, starting with the bottom one`);
            try {
                lastMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await delay(1000);
                const threeDotButton = await findAndClickThreeDots(lastMessage);
                if (!threeDotButton) {
                    console.log('❌ Three dots button not found, trying right click...');
                    const messageEl = lastMessage.querySelector('div[role="button"][aria-label*="Double tap"]') ||
                                    lastMessage.querySelector('div[id*="mid."]');
                    if (messageEl) {
                        messageEl.dispatchEvent(new MouseEvent('contextmenu', {
                            bubbles: true,
                            cancelable: true,
                            button: 2,
                            clientX: messageEl.getBoundingClientRect().left + 10,
                            clientY: messageEl.getBoundingClientRect().top + 10
                        }));
                        await delay(1000);
                    }
                } else {
                    console.log('✅ Clicking three dots button...');
                    const menuOpened = await clickThreeDots(threeDotButton);
                    if (!menuOpened) {
                        console.log('⚠️ Menu status unclear, continuing...');
                    }
                    await delay(1000);
                }
                await delay(800);
                console.log('🔍 Looking for "Unsend" option...');
                const allElements = document.querySelectorAll('*');
                let unsendOption = null;
                const unsendTexts = [
                    'unsend',
                    'delete message',
                    'gönderimi geri al',
                    'mesajı geri al',
                    'geri al',
                    'mesajı sil',
                    'supprimer le message',
                    'eliminar mensaje',
                    'nachricht löschen',
                    'メッセージを削除',
                    'удалить сообщение',
                    'usuń wiadomość',
                    'recall'
                ];
                for (let item of allElements) {
                    const text = item.textContent?.toLowerCase().trim() || '';
                    if (unsendTexts.some(unsendText => text.includes(unsendText))) {
                        const rect = item.getBoundingClientRect();
                        if (rect.width > 0 && rect.height > 0 && rect.width < 500 && rect.height < 100) {
                            foundTexts.push(`"${text}"`);
                            if (item.tagName === 'BUTTON' || 
                                item.getAttribute('role') === 'button' || 
                                item.getAttribute('role') === 'menuitem' ||
                                item.onclick ||
                                item.style.cursor === 'pointer' ||
                                item.closest('[role="button"]') ||
                                item.closest('[role="menuitem"]')) {
                                unsendOption = item;
                                console.log(`✅ Unsend option found: "${text}"`);
                                break;
                            }
                        }
                    }
                }
                if (foundTexts.length > 0) {
                    console.log(`📋 Found texts: ${foundTexts.join(', ')}`);
                }
                if (!unsendOption && foundTexts.length > 0) {
                    console.log('🔍 Checking parent elements...');
                    for (let item of allElements) {
                        const text = item.textContent?.toLowerCase().trim() || '';
                        if (unsendTexts.some(unsendText => text.includes(unsendText))) {
                            const rect = item.getBoundingClientRect();
                            if (rect.width > 0 && rect.height > 0) {
                                let parent = item.parentElement;
                                for (let i = 0; i < 3 && parent; i++) {
                                    if (parent.getAttribute('role') === 'button' || 
                                        parent.getAttribute('role') === 'menuitem' ||
                                        parent.tagName === 'BUTTON') {
                                        unsendOption = parent;
                                        console.log(`✅ Parent element found: "${text}"`);
                                        break;
                                    }
                                    parent = parent.parentElement;
                                }
                                if (unsendOption) break;
                            }
                        }
                    }
                }
                if (!unsendOption) {
                    console.log('❌ "Unsend" option not found');
                    console.log('🔍 Scanning available menu items...');
                    const menuItems = document.querySelectorAll('[role="menuitem"], [role="button"], button');
                    menuItems.forEach((item, index) => {
                        const text = item.textContent?.trim() || '';
                        const rect = item.getBoundingClientRect();
                        if (text && rect.width > 0 && rect.height > 0 && text.length < 100) {
                            console.log(`  ${index}: "${text}"`);
                        }
                    });
                    document.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'Escape',
                        keyCode: 27,
                        bubbles: true
                    }));
                    await delay(500);
                    lastMessage.style.opacity = '0.3';
                    continue;
                }
                console.log('🖱️ Clicking "Unsend" option...');
                await simpleClick(unsendOption);
                await delay(1200);
                console.log('🔍 Looking for confirmation button...');
                const confirmButtons = document.querySelectorAll('button, div[role="button"], span, div');
                let confirmButton = null;
                const confirmTexts = [
                    'unsend',
                    'delete',
                    'confirm',
                    'yes',
                    'ok',
                    'gönderimi geri al',
                    'geri al',
                    'sil',
                    'evet',
                    'tamam',
                    'supprimer',
                    'eliminar',
                    'löschen',
                    'ja',
                    '削除',
                    'はい',
                    'удалить',
                    'да',
                    'usuń',
                    'tak'
                ];
                for (let btn of confirmButtons) {
                    const text = btn.textContent?.trim() || '';
                    if (confirmTexts.some(confirmText => text.toLowerCase() === confirmText.toLowerCase()) && 
                        text.length < 30) {
                        const rect = btn.getBoundingClientRect();
                        if (rect.width > 0 && rect.height > 0) {
                            const isInPopup = btn.closest('[role="dialog"]') || 
                                            btn.closest('[role="alertdialog"]') ||
                                            btn.closest('div[style*="position: fixed"]') ||
                                            btn.closest('div[style*="z-index: 9"]');
                            if (isInPopup) {
                                confirmButton = btn;
                                console.log(`✅ Popup confirm button found: "${text}"`);
                                break;
                            } else if (!confirmButton) {
                                confirmButton = btn;
                                console.log(`✅ Confirm button found: "${text}"`);
                            }
                        }
                    }
                }
                if (!confirmButton) {
                    console.log('🔍 Checking all buttons with unsend-related text...');
                    const allElements2 = document.querySelectorAll('*');
                    for (let element of allElements2) {
                        const text = element.textContent?.trim() || '';
                        if (unsendTexts.some(unsendText => text.toLowerCase().includes(unsendText)) && 
                            text.length < 50) {
                            const rect = element.getBoundingClientRect();
                            if (rect.width > 0 && rect.height > 0 &&
                                (element.tagName === 'BUTTON' || 
                                 element.getAttribute('role') === 'button' ||
                                 element.onclick ||
                                 element.style.cursor === 'pointer')) {
                                confirmButton = element;
                                console.log(`✅ Unsend button found: "${text}"`);
                                break;
                            }
                        }
                    }
                }
                if (confirmButton) {
                    console.log('🖱️ Clicking confirm button...');
                    await simpleClick(confirmButton);
                    deletedCount++;
                    console.log(`🎉 Message #${deletedCount} deleted successfully!`);
                    await delay(800);
                } else {
                    console.log('❌ Confirm button not found, available buttons:');
                    const allButtons = document.querySelectorAll('button, div[role="button"]');
                    allButtons.forEach((btn, index) => {
                        const text = btn.textContent?.trim() || '';
                        const rect = btn.getBoundingClientRect();
                        if (text && rect.width > 0 && rect.height > 0 && text.length < 100) {
                            console.log(`  Button ${index}: "${text}"`);
                        }
                    });
                    console.log('Sending ESC key');
                    document.dispatchEvent(new KeyboardEvent('keydown', { 
                        key: 'Escape', 
                        keyCode: 27,
                        bubbles: true 
                    }));
                    await delay(1000);
                }
            } catch (error) {
                console.log('❌ Error occurred:', error.message);
                await delay(1500);
            }
            if (deletedCount % 5 === 0 && deletedCount > 0) {
                console.log(`⏸️ ${deletedCount} messages deleted, short break...`);
                await delay(1000);
            }
            scrollToBottom();
            await delay(400);
        }
        console.log(`\n🎉 OPERATION COMPLETED!`);
        console.log(`📊 Total ${deletedCount} messages deleted.`);
        if (attempts >= maxAttempts) {
            console.log('⚠️ Maximum attempts reached.');
        }
    }
    console.log('🚀 Starting in 3 seconds... (Refresh page to cancel)');
    await delay(3000);
    await deleteMessages();
})();
